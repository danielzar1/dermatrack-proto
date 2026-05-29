"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// "/clinician/patients" — bounce to the dashboard, where the patient
// roster lives. Client-side redirect so it works in static export.
export default function PatientsIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/clinician");
  }, [router]);
  return (
    <main className="mx-auto max-w-md p-8 text-center text-[14px] text-ink-soft">
      Redirecting to the patient roster… <Link href="/clinician" className="underline">tap here</Link> if not redirected.
    </main>
  );
}
