# DermaTrack — Architecture

Status: **draft v1** · 2026-05-17 · owner: Daniel
Scope of this document: the production web application, starting with a thin
vertical slice. The single-file prototype (`index.html` / the public
`dermatrack-demo` repo) is the **interaction spec**, not the codebase.

---

## 1. Purpose & guiding decisions

DermaTrack is a POPIA-aware dermatology tracking product: patients capture
serial skin photos and symptoms; clinicians review them, code diagnoses,
assign protocols and prescribe. The prototype demonstrates the full intended
surface; this document defines how we build the real thing.

Decisions already locked (from prior product discussion):

| Decision | Choice | Notes |
|---|---|---|
| Language | TypeScript end-to-end | One type system, app → DB types |
| Client | Web-first PWA | Mobile (native) deferred until web is built out |
| Backend | Supabase (Postgres, Auth, Storage, RLS) | Fastest path; maps 1:1 to the spec |
| First target | Thin vertical slice | Patient capture + clinician review, full auth/consent/audit |
| Data residency | **Open risk — tracked in §8** | Managed Supabase to prove the concept; SA residency is the production target |
| Design system | Port from the prototype | CSS tokens/components are the durable asset |

**Non-negotiable principles**

1. **Privacy & audit by design.** Health data is POPIA *special personal
   information*. Access control lives in the database (RLS), not just app
   code. Every read and write of patient data is audit-logged.
2. **The database is the security boundary.** If the app server is fully
   compromised, RLS still prevents one patient seeing another's data.
3. **No real patient PHI until residency is resolved (§8).** Concept-proving
   uses synthetic data only. This is a hard gate.
4. **Trust internal code; validate at boundaries.** Strong typing internally;
   strict validation of all external input (uploads, auth, API).
5. **The prototype is the UX contract.** Visual/flow changes are decided
   against the prototype, then ported.

---

## 2. Stack

### Frontend
- **Next.js (App Router) + React + TypeScript**, deployed as an installable
  **PWA**. App Router with React Server Components for data-bearing pages.
- **Styling: Tailwind CSS v4**, with the prototype's CSS custom properties
  ported verbatim into the `@theme` layer (paper/navy/sage/clay palette,
  radii, shadows, the Newsreader/Spline Sans pairing). A thin component layer
  reproduces the prototype's `card`, `btn`, `chip`, body-map, etc.
  - *Alternative considered:* CSS Modules + raw tokens (closest to the
    prototype, least abstraction). Tailwind chosen for velocity and a shared
    token vocabulary; revisit if it fights the design.
- **Data/state:** Server Components for reads where possible; **TanStack
  Query** for client-side cache/mutations; `@supabase/ssr` for cookie-based
  auth in the App Router (the current supported pattern — *not* the
  deprecated auth-helpers).
- **Forms/validation:** React Hook Form + **Zod**. Zod schemas are shared
  between client and server (single source of truth for shapes).

### Backend
- **Supabase**:
  - **Postgres** — system of record. Business rules expressed as
    constraints, RLS policies, and triggers wherever they protect data
    integrity or access.
  - **Auth** — email magic-link (mirrors the prototype's magic-link intake
    and patient/clinician entry). Roles via a `profiles` table.
  - **Storage** — private bucket for lesion images; access via short-lived
    server-minted signed URLs only.
  - **Edge Functions** — for server-side work that must not run on the
    client (e.g. later: script PDF generation). Not needed for slice 1.
- **App server logic:** Next.js Route Handlers / Server Actions for
  orchestration. PHI read/write **always** goes through a server-side data
  access layer that writes an audit row in the same transaction (§5).

### Tooling
- Supabase CLI for the local stack and migrations (SQL migrations committed
  to the repo; typed DB types generated into the app).
- pnpm, ESLint, Prettier, `tsc --noEmit` in CI.
- **Playwright** e2e covering the slice-1 loop (the same click-through path
  we verified on the prototype becomes the acceptance test).
- **pgTAP** (or Supabase's policy test harness) for RLS policy tests — these
  are security tests, not optional.

---

## 3. Thin vertical slice (Slice 1)

**Goal:** prove the whole architecture — auth, roles, RLS, storage, consent,
audit — on the smallest end-to-end loop.

In scope:
1. Patient signs in via magic link; first-launch **POPIA consent** captured
   (versioned, granular, required vs optional) before any PHI.
2. Patient creates a **lesion** on a body region and uploads a **photo**
   (stored encrypted, private).
3. A **care link** connects that patient to a clinician (seeded for slice 1).
4. Clinician signs in, sees only their linked + consented patients, opens the
   patient, views the photo, **adds a review note / marks reviewed**.
5. Every PHI access writes an **audit_log** row; the patient can see their own
   **access log** ("who viewed my data").

Explicitly **out** of slice 1 (later roadmap, §10): ICD-10 coding, protocols,
prescribing/PDF, pre-consult intake, secretary mode, data export/delete UI,
offline, push notifications, native app.

**Acceptance criteria**
- Playwright: patient consent → capture → clinician review loop is green.
- RLS tests: patient A cannot read patient B; clinician with no care-link
  sees nothing; withdrawing required consent blocks clinician access.
- Every step in the loop produces the expected `audit_log` rows.
- Zero unhandled client errors (same bar we held the prototype to).

---

## 4. Data model (slice 1)

Sketch — column lists abbreviated; all tables have `id uuid pk`,
`created_at`, `updated_at`.

- **profiles** — `user_id` (= `auth.users.id`), `role` (`patient`|`clinician`),
  `display_name`. One row per auth user.
- **patients** — `profile_id`, demographics. A patient *is* a profile with
  `role='patient'`; this table holds the clinical identity.
- **clinicians** — `profile_id`, registration metadata.
- **care_links** — `patient_id`, `clinician_id`, `status`
  (`active`|`revoked`), timestamps. Encodes "who is allowed to treat".
- **consents** — `patient_id`, `type`
  (`store_phi`|`share_with_clinician`|`reminders`|`research`),
  `granted` bool, `policy_version`, `granted_at`, `withdrawn_at`. Append a new
  row per change (full history); current state = latest per `(patient,type)`.
- **lesions** — `patient_id`, `body_region`, `lesion_no`, `type`, `status`
  (`active`|`calm`|`resolved`). Numbers persist for the patient's lifetime.
- **lesion_photos** — `lesion_id`, `storage_path`, `taken_at`, `captured_by`.
- **reviews** — `lesion_id`, `clinician_id`, `note`, `reviewed_at`.
- **audit_log** — `actor_id`, `action`, `subject_patient_id`,
  `target` (table/row), `context` jsonb, `at`. **Append-only**
  (no UPDATE/DELETE grant to app roles).

### RLS posture (the core of the design)

Enabled on every table. Helper SQL functions: `is_clinician()`,
`current_patient_id()`, and `clinician_can_access(patient_id)` which returns
true only when an `active` `care_link` exists **and** the patient's
`share_with_clinician` consent is currently granted.

Representative policies:

```sql
-- A patient sees only their own lesions
create policy patient_reads_own_lesions on lesions
  for select using ( patient_id = current_patient_id() );

-- A clinician sees a patient's lesions only with an active, consented link
create policy clinician_reads_linked_lesions on lesions
  for select using ( clinician_can_access(patient_id) );

-- audit_log: insert-only for app roles; readable by the subject patient
revoke update, delete on audit_log from authenticated;
create policy patient_reads_own_audit on audit_log
  for select using ( subject_patient_id = current_patient_id() );
```

Withdrawing the `share_with_clinician` consent makes
`clinician_can_access()` return false → the clinician immediately loses
visibility, enforced at the DB. This is the POPIA consent-withdrawal
guarantee made structural.

### Auditing reads (the subtle part)

RLS controls *access* but does not *log* it, and "who accessed my data" is a
product feature. Rule: **PHI is never read directly from client code.** All
PHI reads/writes go through server-side data-access functions (Server
Actions / Route Handlers, or `SECURITY DEFINER` RPCs) that write the
`audit_log` row in the **same transaction** as the access. Signed URLs for
photos are minted server-side and the mint is audited. A read that isn't
audited is a bug.

---

## 5. Security & POPIA mapping

| POPIA obligation | Implementation |
|---|---|
| Lawful processing / consent | `consents` table, versioned & withdrawable; required consents gate all PHI; consent changes audited |
| Purpose limitation | Data only exposed via care-link + consent; no secondary use; research consent separate & opt-in |
| Data subject access | `audit_log` powers the patient access-log screen; export/delete is roadmap (§10) but schema is built for it |
| Security safeguards | RLS as primary boundary; TLS in transit; encryption at rest (Supabase/Postgres); least-privilege DB roles; private storage + signed URLs |
| Further processing limitation | Clinician cannot re-share; no third-party egress in slice 1 |
| Retention | `policy_version` + timestamps support a scheduled retention/erasure job (HPCSA 6-year norm); job is roadmap |
| Operator / cross-border | **Open — §8.** Managed Supabase is an operator possibly outside SA; gated to synthetic data until resolved |
| Information Officer | Operational, not code; reflected in product copy |

Threats explicitly designed against: app-server compromise (RLS still
holds), broken object-level authorization (no client-side PHI fetch; RLS +
audited DAL), consent bypass (`clinician_can_access` is the single
chokepoint), enumeration (uuid keys, RLS on every table).

---

## 6. Environments & deployment

- **Local:** Supabase CLI local stack + `next dev`. Synthetic seed data.
- **Preview/staging:** Supabase project + Vercel preview deploys per PR.
- **Production (concept-proving phase):** managed Supabase + Vercel —
  **synthetic data only** (§3 hard gate).
- **Production (real PHI):** SA-resident — see §8.

**Compute–data co-location caveat (important):** even with the database in
South Africa, if Next.js Server Actions run on Vercel's default (non-SA)
regions, PHI is *processed* outside SA in transit/compute — that is itself
cross-border processing under POPIA. For real PHI, application compute must
be co-located with the data in SA (pin function region, or self-host the
Next server in-region). Acceptable during concept-proving because no real
PHI exists then.

---

## 7. Repository & project structure

The real app is a **new, private repository** — separate from the public
`dermatrack-demo`. Proposed single Next.js app (no monorepo needed yet):

```
dermatrack-app/
  app/                 # Next.js App Router (route groups: (patient), (clinician), (auth))
  components/           # ported design-system components
  lib/
    supabase/           # server & browser clients (@supabase/ssr)
    data/               # audited data-access layer — the ONLY PHI path
    validation/         # shared Zod schemas
  styles/               # Tailwind v4 theme = ported prototype tokens
  supabase/
    migrations/         # SQL migrations (source of truth for schema + RLS)
    tests/              # pgTAP RLS/policy tests
  e2e/                  # Playwright (slice-1 loop)
  ARCHITECTURE.md       # this document, lives with the code it describes
```

---

## 8. Open risk: data residency (tracked decision)

**The single most consequential, hardest-to-reverse decision.** POPIA treats
health data as special personal information; the product's own privacy copy
promises South African storage.

- **Concept-proving (now):** managed Supabase (nearest region is typically
  EU, not SA) + Vercel. **Mitigation:** synthetic data only; no real patient
  is onboarded; privacy copy in any shared build must not claim SA-only until
  it is true.
- **Production target:** SA residency. Two viable paths, decision deferred to
  end of concept-proving:
  1. **Self-hosted Supabase on AWS Cape Town (af-south-1)** — keeps the whole
     Supabase developer experience; app code is ~identical to managed, so we
     don't pay twice. Preferred unless ops cost is prohibitive.
  2. **Managed Postgres in af-south-1** (RDS) + drop Supabase client libs —
     most control, least velocity.
- **Decision owner:** Daniel. **Trigger to decide:** before any real patient
  data enters the system. **Needs:** confirmation of current SA Information
  Regulator contact details and a POPIA legal review of the operator /
  cross-border position.

Other tracked risks: PWA camera quality for *serial* (consistently framed)
photos — the main thing that could later force native; offline capture
(deferred); digital script signatures (deferred — physical signature only,
as the prototype already states).

---

## 9. Conventions

- Migrations are forward-only and reviewed; schema/RLS never changed by hand
  in a deployed environment.
- DB types generated from the live schema; no hand-maintained DB types.
- Zod at every external boundary; trust types internally.
- No PHI in logs, error messages, or analytics.
- Every PHI code path has a corresponding RLS test and emits an audit row.

---

## 10. Roadmap after Slice 1

Sequenced so each builds on a proven base:

1. Pre-consult intake (magic link) + clinician pre-consult summary.
2. ICD-10 differential/confirmed coding.
3. Protocols & checklists.
4. Prescribing + signed-script PDF (Edge Function) + send/audit.
5. Data-subject rights UI (export, correction, delete) + retention job.
6. Notifications/reminders (consent-gated).
7. Residency cutover to SA production (§8) — **before real patients**.
8. Native mobile evaluation (camera/offline driven).
```
