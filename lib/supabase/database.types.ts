// PLACEHOLDER — regenerate from the live schema once Supabase is running:
//   pnpm db:types
//
// `any` here is deliberate and temporary: it lets the typed Supabase
// clients and the data-access layer compile BEFORE the schema exists.
// `pnpm db:types` overwrites this file with the real, strict generated
// types — at which point the data layer becomes fully type-checked. Do
// not build on this loose shape; treat strict types as the target state.
//
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any;
