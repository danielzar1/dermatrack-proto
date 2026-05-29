import { NextResponse, type NextRequest } from "next/server";

// Prototype-mode middleware: no-op pass-through.
// In production this refreshes the Supabase auth session (see
// lib/supabase/middleware.ts:updateSession). For the demo we have no
// backend wired up — role state lives client-side in localStorage and
// is gated only by the cover/role-pick page. Restore updateSession()
// before any real PHI is stored.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
