import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type AuditEvent = {
  action: string; // e.g. "lesion.create", "photo.view", "review.add"
  subjectPatientId: string | null; // whose data was touched
  target?: string; // table/row, free text
  context?: Record<string, unknown>;
};

/**
 * Records an audit row for a PHI access/mutation.
 *
 * ARCHITECTURE.md §4: a PHI access that isn't audited is a bug. In
 * production these writes should be folded into the same Postgres
 * transaction as the data operation via a SECURITY DEFINER RPC so they
 * cannot diverge. This scaffold keeps them adjacent and explicit; the RPC
 * hardening is a Slice-1 task.
 */
export async function recordAudit(
  supabase: SupabaseClient<Database>,
  event: AuditEvent,
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("audit_log").insert({
    actor_id: user?.id ?? null,
    action: event.action,
    subject_patient_id: event.subjectPatientId,
    target: event.target ?? null,
    context: event.context ?? {},
  });

  // Audit failures must be loud, never swallowed.
  if (error) throw new Error(`audit write failed for "${event.action}": ${error.message}`);
}
