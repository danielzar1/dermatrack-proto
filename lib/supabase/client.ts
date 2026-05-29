"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

// Browser Supabase client. Uses the anon key — RLS is the security
// boundary (ARCHITECTURE.md §1). NEVER read PHI directly with this in
// client components; go through the audited server data layer (lib/data).
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
