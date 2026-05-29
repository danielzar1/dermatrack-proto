"use client";

import { useRouter } from "next/navigation";
import { Icon } from "./Icons";
import { setDemoRole } from "@/lib/demo/role";

/**
 * Floating role-switch chip — visible across the app so the panel can
 * pivot between the clinician dashboard and the patient PWA without
 * going back to the cover page. Demo aid; not part of the production
 * design.
 */

type Props = {
  current: "clinician" | "patient";
};

export function RoleSwitcher({ current }: Props) {
  const router = useRouter();
  const other = current === "clinician" ? "patient" : "clinician";
  const label = current === "clinician" ? "Switch to patient" : "Switch to clinician";

  return (
    <button
      type="button"
      onClick={() => {
        setDemoRole(other);
        router.push(other === "clinician" ? "/clinician" : "/patient");
      }}
      className={`fixed right-4 z-[88] flex items-center gap-2 rounded-full border border-line bg-card/90 px-4 py-2.5 text-[12.5px] font-semibold text-ink shadow-[var(--shadow-lg)] backdrop-blur-md transition hover:border-navy hover:bg-card ${
        // Patient view has a bottom nav inside the phone frame on mobile —
        // bump the chip above it. Desktop puts the phone frame in the
        // middle so the chip sits in the page corner regardless.
        current === "patient"
          ? "bottom-[88px] lg:bottom-5"
          : "bottom-4"
      }`}
      title="Toggle the patient/clinician view"
    >
      {current === "clinician" ? <Icon.Heart size={13} /> : <Icon.Eye size={13} />}
      {label}
    </button>
  );
}
