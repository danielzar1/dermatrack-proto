"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/Icons";
import { setDemoRole } from "@/lib/demo/role";

/**
 * Prototype login. In production this is real Supabase magic-link auth
 * (see git history for the previous implementation, and the
 * @/lib/supabase/client → signInWithOtp flow). For the interview demo we
 * bypass it: role selection is enough to drop into the right shell.
 */
function LoginInner() {
  const params = useSearchParams();
  const router = useRouter();
  const role: "clinician" | "patient" =
    params.get("role") === "patient" ? "patient" : "clinician";

  const enter = () => {
    setDemoRole(role);
    router.push(role === "clinician" ? "/clinician" : "/patient");
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 p-8">
      <div>
        <p className="eyebrow">
          {role === "clinician" ? "Clinician sign-in" : "Patient sign-in"}
        </p>
        <h1 className="mt-2 font-serif text-[32px] text-navy-deep">Sign in</h1>
        <p className="mt-2 text-sm text-ink-soft">
          In production this is a Supabase magic link &mdash; no passwords. For
          the demo, continue without sending an email.
        </p>
      </div>

      <div className="card flex flex-col gap-3">
        <label className="text-[12.5px] font-semibold text-ink-soft">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          defaultValue={role === "clinician" ? "jdamelin@demo.dermatrack.co.za" : "patient@demo.dermatrack.co.za"}
          className="input"
        />
        <button type="button" onClick={enter} className="btn">
          <Icon.Send size={15} />
          Email me a sign-in link
        </button>
        <button
          type="button"
          onClick={enter}
          className="btn btn-ghost"
        >
          Continue without email · demo
        </button>
      </div>

      <p className="text-center text-[12px] text-ink-faint">
        <Link href="/" className="underline">
          Back to cover
        </Link>
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
