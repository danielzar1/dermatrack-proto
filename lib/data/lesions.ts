import "server-only";

import { createClient } from "@/lib/supabase/server";
import { recordAudit } from "./audit";
import {
  createLesionSchema,
  addReviewSchema,
  type CreateLesionInput,
  type AddReviewInput,
} from "@/lib/validation/schemas";

/**
 * The audited data-access layer is the ONLY path PHI flows through
 * (ARCHITECTURE.md §4). Each function: validate input → perform the DB
 * operation under RLS → write an audit row. RLS still enforces *who* may
 * do this; this layer guarantees it is *recorded*.
 *
 * Slice-1 hardening TODO: fold each (write + audit) pair into a single
 * SECURITY DEFINER Postgres RPC so they are atomic.
 */

export async function createLesion(input: CreateLesionInput): Promise<{ id: string }> {
  const { bodyRegion, lesionType } = createLesionSchema.parse(input);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: patient, error: pErr } = await supabase
    .from("patients")
    .select("id")
    .eq("profile_id", user.id)
    .single();
  if (pErr || !patient) throw new Error("No patient record for current user");
  const patientId = patient.id as string;

  // Next lesion number for this patient (numbers persist for life).
  const { data: last } = await supabase
    .from("lesions")
    .select("lesion_no")
    .eq("patient_id", patientId)
    .order("lesion_no", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextNo = ((last?.lesion_no as number | undefined) ?? 0) + 1;

  const { data: created, error: cErr } = await supabase
    .from("lesions")
    .insert({
      patient_id: patientId,
      body_region: bodyRegion,
      lesion_no: nextNo,
      lesion_type: lesionType ?? null,
    })
    .select("id")
    .single();
  if (cErr || !created) throw new Error(`Create lesion failed: ${cErr?.message}`);

  await recordAudit(supabase, {
    action: "lesion.create",
    subjectPatientId: patientId,
    target: `lesions/${created.id}`,
    context: { bodyRegion, lesionNo: nextNo },
  });

  return { id: created.id as string };
}

export async function addReview(input: AddReviewInput): Promise<{ id: string }> {
  const { lesionId, note } = addReviewSchema.parse(input);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: clinician, error: clErr } = await supabase
    .from("clinicians")
    .select("id")
    .eq("profile_id", user.id)
    .single();
  if (clErr || !clinician) throw new Error("Not a clinician");

  // RLS guarantees the clinician may only see this lesion if care-linked
  // and consented; this read also confirms access for the audit subject.
  const { data: lesion, error: lErr } = await supabase
    .from("lesions")
    .select("id, patient_id")
    .eq("id", lesionId)
    .single();
  if (lErr || !lesion) throw new Error("Lesion not accessible");

  const { data: review, error: rErr } = await supabase
    .from("reviews")
    .insert({ lesion_id: lesionId, clinician_id: clinician.id as string, note })
    .select("id")
    .single();
  if (rErr || !review) throw new Error(`Add review failed: ${rErr?.message}`);

  await recordAudit(supabase, {
    action: "review.add",
    subjectPatientId: lesion.patient_id as string,
    target: `reviews/${review.id}`,
  });

  return { id: review.id as string };
}
