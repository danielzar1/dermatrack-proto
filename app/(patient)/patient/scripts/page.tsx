"use client";

import Link from "next/link";
import { patients } from "@/lib/mock/patients";
import { Icon } from "@/components/Icons";
import { useToast } from "@/components/Toaster";

export default function PatientScripts() {
  const patient = patients[0]!;
  const { toast } = useToast();
  const active = patient.prescriptions.filter((rx) => rx.status === "active");

  return (
    <div>
      <Link
        href="/patient/data"
        className="inline-flex items-center gap-1.5 pt-2 text-[13px] text-ink-soft"
      >
        <Icon.ChevronLeft size={15} />
        Privacy
      </Link>

      <p className="eyebrow mt-2">From {patient.protocols[0]?.assignedBy ?? "your clinician"}</p>
      <h1 className="mt-1 font-serif text-[24px]">My prescriptions</h1>
      <p className="mt-1 text-[13px] text-ink-soft">
        Active and historical scripts on your record.
      </p>

      <h2 className="mt-4 font-serif text-[17px]">Active</h2>
      <div className="card-flush mt-2">
        {active.map((rx, i) => (
          <button
            type="button"
            key={rx.id}
            onClick={() => toast(`${rx.drug} — full script details`)}
            className={`flex w-full items-center gap-3 px-3 py-3 text-left ${
              i > 0 ? "border-t border-line" : ""
            }`}
          >
            <span className="grid size-9 flex-shrink-0 place-items-center rounded-md bg-navy-tint text-navy">
              <Icon.Pill size={15} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold">{rx.drug}</p>
              <p className="truncate text-[11.5px] text-ink-faint">{rx.signa}</p>
            </div>
            <span className="chip chip-sage flex-shrink-0">{rx.schedule}</span>
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-ink-faint">
        Tap any script for the full details
        <br />
        and the pharmacy that dispensed it.
      </p>
    </div>
  );
}
