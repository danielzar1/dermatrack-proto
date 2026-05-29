-- ============================================================================
-- DermaTrack — Slice 1 schema
-- See ARCHITECTURE.md §3 (slice scope) and §4 (data model / RLS posture).
--
-- Security model: RLS is THE boundary. Every table has RLS enabled. A
-- clinician sees a patient's data only when (a) an active care_link exists
-- AND (b) the patient's `share_with_clinician` consent is currently granted.
-- Withdrawing that consent revokes access at the database, immediately.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type user_role        as enum ('patient', 'clinician');
create type care_link_status as enum ('active', 'revoked');
create type consent_type     as enum ('store_phi', 'share_with_clinician', 'reminders', 'research');
create type lesion_status    as enum ('active', 'calm', 'resolved');

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  role         user_role not null,
  display_name text not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.patients (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clinicians (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.care_links (
  id           uuid primary key default gen_random_uuid(),
  patient_id   uuid not null references public.patients(id)   on delete cascade,
  clinician_id uuid not null references public.clinicians(id) on delete cascade,
  status       care_link_status not null default 'active',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (patient_id, clinician_id)
);

-- Append-only consent ledger. Current state = latest row per (patient, type).
create table public.consents (
  id             uuid primary key default gen_random_uuid(),
  patient_id     uuid not null references public.patients(id) on delete cascade,
  type           consent_type not null,
  granted        boolean not null,
  policy_version text not null,
  granted_at     timestamptz,
  withdrawn_at   timestamptz,
  created_at     timestamptz not null default now()
);
create index consents_lookup on public.consents (patient_id, type, created_at desc);

create table public.lesions (
  id          uuid primary key default gen_random_uuid(),
  patient_id  uuid not null references public.patients(id) on delete cascade,
  body_region text not null,
  lesion_no   int  not null,
  lesion_type text,
  status      lesion_status not null default 'active',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (patient_id, lesion_no)
);

create table public.lesion_photos (
  id           uuid primary key default gen_random_uuid(),
  lesion_id    uuid not null references public.lesions(id) on delete cascade,
  storage_path text not null,
  taken_at     timestamptz not null default now(),
  captured_by  uuid references public.profiles(id),
  created_at   timestamptz not null default now()
);

create table public.reviews (
  id           uuid primary key default gen_random_uuid(),
  lesion_id    uuid not null references public.lesions(id) on delete cascade,
  clinician_id uuid not null references public.clinicians(id) on delete cascade,
  note         text not null,
  reviewed_at  timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

-- Append-only. No UPDATE/DELETE grant to app roles (see grants below).
create table public.audit_log (
  id                 uuid primary key default gen_random_uuid(),
  actor_id           uuid,
  action             text not null,
  subject_patient_id uuid,
  target             text,
  context            jsonb not null default '{}'::jsonb,
  at                 timestamptz not null default now()
);
create index audit_log_subject on public.audit_log (subject_patient_id, at desc);

-- updated_at triggers
create trigger t_profiles_updated  before update on public.profiles   for each row execute function public.set_updated_at();
create trigger t_patients_updated  before update on public.patients   for each row execute function public.set_updated_at();
create trigger t_clin_updated      before update on public.clinicians for each row execute function public.set_updated_at();
create trigger t_links_updated     before update on public.care_links for each row execute function public.set_updated_at();
create trigger t_lesions_updated   before update on public.lesions    for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Access helper functions (the single chokepoint for clinician access)
-- ---------------------------------------------------------------------------
create or replace function public.is_clinician()
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'clinician');
$$;

create or replace function public.current_patient_id()
returns uuid language sql stable security definer set search_path = public, pg_temp as $$
  select id from public.patients where profile_id = auth.uid();
$$;

-- Current state of a consent = the most recently created row for (patient, type).
create or replace function public.consent_active(p_patient_id uuid, p_type consent_type)
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select coalesce(
    (select granted
       from public.consents
      where patient_id = p_patient_id and type = p_type
      order by created_at desc
      limit 1),
    false);
$$;

create or replace function public.clinician_can_access(p_patient_id uuid)
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select public.is_clinician()
     and exists (
       select 1
         from public.care_links cl
         join public.clinicians c on c.id = cl.clinician_id
        where cl.patient_id = p_patient_id
          and c.profile_id  = auth.uid()
          and cl.status     = 'active')
     and public.consent_active(p_patient_id, 'share_with_clinician');
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles      enable row level security;
alter table public.patients      enable row level security;
alter table public.clinicians    enable row level security;
alter table public.care_links    enable row level security;
alter table public.consents      enable row level security;
alter table public.lesions       enable row level security;
alter table public.lesion_photos enable row level security;
alter table public.reviews       enable row level security;
alter table public.audit_log     enable row level security;

-- profiles: own profile; clinicians may read profiles of accessible patients
create policy profiles_select on public.profiles for select to authenticated
  using (
    id = auth.uid()
    or exists (select 1 from public.patients p
                where p.profile_id = profiles.id
                  and public.clinician_can_access(p.id))
  );
create policy profiles_upsert_own on public.profiles for insert to authenticated
  with check (id = auth.uid());
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- patients: own row; clinician with active+consented link
create policy patients_select on public.patients for select to authenticated
  using (profile_id = auth.uid() or public.clinician_can_access(id));
create policy patients_insert_own on public.patients for insert to authenticated
  with check (profile_id = auth.uid());

-- clinicians: own row; a linked patient may read their clinician's row
create policy clinicians_select on public.clinicians for select to authenticated
  using (
    profile_id = auth.uid()
    or exists (select 1 from public.care_links cl
                where cl.clinician_id = clinicians.id
                  and cl.patient_id   = public.current_patient_id()
                  and cl.status       = 'active')
  );
create policy clinicians_insert_own on public.clinicians for insert to authenticated
  with check (profile_id = auth.uid());

-- care_links: visible to the patient and the clinician on the link
create policy care_links_select on public.care_links for select to authenticated
  using (
    patient_id = public.current_patient_id()
    or exists (select 1 from public.clinicians c
                where c.id = care_links.clinician_id and c.profile_id = auth.uid())
  );

-- consents: patient manages own; clinician may read (to show consent status)
create policy consents_select on public.consents for select to authenticated
  using (patient_id = public.current_patient_id() or public.clinician_can_access(patient_id));
create policy consents_insert_own on public.consents for insert to authenticated
  with check (patient_id = public.current_patient_id());
-- (no update/delete policy: ledger is append-only)

-- lesions: patient full control of own; clinician read-only with access
create policy lesions_select on public.lesions for select to authenticated
  using (patient_id = public.current_patient_id() or public.clinician_can_access(patient_id));
create policy lesions_insert_own on public.lesions for insert to authenticated
  with check (patient_id = public.current_patient_id());
create policy lesions_update_own on public.lesions for update to authenticated
  using (patient_id = public.current_patient_id())
  with check (patient_id = public.current_patient_id());

-- lesion_photos: scoped via the owning lesion's patient
create policy lesion_photos_select on public.lesion_photos for select to authenticated
  using (exists (select 1 from public.lesions l
                  where l.id = lesion_photos.lesion_id
                    and (l.patient_id = public.current_patient_id()
                         or public.clinician_can_access(l.patient_id))));
create policy lesion_photos_insert_own on public.lesion_photos for insert to authenticated
  with check (exists (select 1 from public.lesions l
                       where l.id = lesion_photos.lesion_id
                         and l.patient_id = public.current_patient_id()));

-- reviews: clinician with access writes; patient reads reviews on own lesions
create policy reviews_select on public.reviews for select to authenticated
  using (exists (select 1 from public.lesions l
                  where l.id = reviews.lesion_id
                    and (l.patient_id = public.current_patient_id()
                         or public.clinician_can_access(l.patient_id))));
create policy reviews_insert on public.reviews for insert to authenticated
  with check (
    exists (select 1 from public.lesions l
             where l.id = reviews.lesion_id and public.clinician_can_access(l.patient_id))
    and exists (select 1 from public.clinicians c
                 where c.id = reviews.clinician_id and c.profile_id = auth.uid())
  );

-- audit_log: append-only; the subject patient can read their own access log
revoke update, delete on public.audit_log from authenticated;
create policy audit_insert on public.audit_log for insert to authenticated
  with check (true);
create policy audit_select_subject on public.audit_log for select to authenticated
  using (subject_patient_id = public.current_patient_id());

-- ---------------------------------------------------------------------------
-- Storage: private lesion-photo bucket
-- Path convention: {patient_id}/{lesion_id}/{filename}
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('lesion-photos', 'lesion-photos', false)
on conflict (id) do nothing;

create policy lesion_photos_storage_select on storage.objects for select to authenticated
  using (
    bucket_id = 'lesion-photos'
    and (
      ((storage.foldername(name))[1])::uuid = public.current_patient_id()
      or public.clinician_can_access(((storage.foldername(name))[1])::uuid)
    )
  );
create policy lesion_photos_storage_insert on storage.objects for insert to authenticated
  with check (
    bucket_id = 'lesion-photos'
    and ((storage.foldername(name))[1])::uuid = public.current_patient_id()
  );
