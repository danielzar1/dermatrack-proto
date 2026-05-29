import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// SERVICE ROLE client — bypasses RLS. Server-only (the `server-only` import
// makes a client bundle fail the build if this is ever imported there).
// Use ONLY for privileged operations that cannot be expressed under RLS
// (e.g. minting signed URLs, seeding). Every use must still be audited.
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");

  return createSupabaseClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
