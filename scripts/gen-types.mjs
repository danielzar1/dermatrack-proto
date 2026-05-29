// Generates lib/supabase/database.types.ts from the local Supabase schema.
// Safe: only overwrites the file on success with non-empty output, so a
// missing CLI or stopped DB can never blank the placeholder (which would
// break every typed client).
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const OUT = "lib/supabase/database.types.ts";

const res = spawnSync(
  "supabase",
  ["gen", "types", "typescript", "--local"],
  { encoding: "utf8", shell: true },
);

if (res.error || res.status !== 0 || !res.stdout || res.stdout.trim().length < 50) {
  console.error(
    "db:types failed — the placeholder was left untouched.\n" +
      "Ensure the Supabase CLI is installed and `supabase start` is running.\n" +
      (res.stderr || res.error?.message || "no output from supabase"),
  );
  process.exit(1);
}

writeFileSync(OUT, res.stdout);
console.log(`Wrote ${OUT}`);
