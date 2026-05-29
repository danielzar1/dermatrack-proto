"use client";

/**
 * Prototype-only role state. In production this is replaced by Supabase
 * auth + a `profiles.role` column (see ARCHITECTURE.md §3/§4). For the
 * demo, we just keep a role flag in localStorage so the cover page can
 * route users into the patient or clinician shell without an auth round
 * trip.
 */

export type Role = "patient" | "clinician";

const KEY = "dermatrack.demo.role";

export function setDemoRole(role: Role): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, role);
  } catch {
    /* sandboxed — ignore */
  }
}

export function getDemoRole(): Role | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "patient" || v === "clinician" ? v : null;
  } catch {
    return null;
  }
}

export function clearDemoRole(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
