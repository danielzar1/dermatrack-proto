"use client";

import Link from "next/link";
import { patients } from "@/lib/mock/patients";
import { SkinPhoto } from "@/components/SkinPhoto";
import { Icon } from "@/components/Icons";
import { useToast } from "@/components/Toaster";
import { useState } from "react";

/**
 * Patient home — the "today" view. For the demo, the signed-in patient
 * is Hadassah (HF). Shows the alert, severity trend, lesion thumbnails,
 * treatment plan progress, today's check-in.
 */
export default function PatientHome() {
  // Demo: the logged-in patient is the first one in the roster (HF).
  const patient = patients[0]!;
  const { toast } = useToast();
  const [itch, setItch] = useState<number | null>(4);

  const lesionAlert = patient.lesions.find((l) => l.status === "active");
  const latest = patient.severityTrend[patient.severityTrend.length - 1];
  const earliest = patient.severityTrend[0];
  const delta = latest && earliest ? latest.value - earliest.value : 0;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <span
            className="grid size-10 place-items-center rounded-full text-white"
            style={{ background: "linear-gradient(145deg,#2c4d78,#15273f)" }}
          >
            <span className="text-[13px] font-semibold">{patient.code}</span>
          </span>
          <div>
            <p className="text-[11px] text-ink-faint">Good morning</p>
            <p className="text-[15px] font-semibold leading-tight">{patient.name.split(" ")[0]}</p>
          </div>
        </div>
        <Link
          href="/patient/data"
          className="grid size-9 place-items-center rounded-full border border-line bg-card text-ink-soft"
          aria-label="Privacy"
        >
          <Icon.Lock size={15} />
        </Link>
      </div>

      <p className="eyebrow">This week</p>
      <h1 className="mt-1 font-serif text-[26px] leading-tight">
        Your skin is{" "}
        <span className="text-sage-deep">trending calmer.</span>
      </h1>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat v={String(patient.lesions.length)} l="Lesions tracked" />
        <Stat v="12" l="Photos logged" />
        <Stat v={`${itch ?? "—"}/10`} l="Itch today" />
      </div>

      {lesionAlert && (
        <Link
          href={`/patient/lesions/${lesionAlert.num}` as const}
          className="mt-4 flex items-start gap-3 rounded-[15px] border border-[#e6c3b0] bg-clay-tint/60 p-3"
        >
          <span className="grid size-7 flex-shrink-0 place-items-center rounded-md bg-clay text-white">
            <Icon.Alert size={14} />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-[#9a4a26]">
              Dr Damelin flagged a lesion for review
            </p>
            <p className="text-[12px] text-[#8a5238]">
              {lesionAlert.region} — tap to see the note and add a fresh photo.
            </p>
          </div>
        </Link>
      )}

      <div className="mt-5 flex items-center justify-between">
        <h2 className="font-serif text-[17px]">Your treatment plan</h2>
        <Link href="/patient/treatment" className="text-[12px] font-semibold text-sage-deep">
          Open →
        </Link>
      </div>
      {patient.protocols[0] && (
        <Link
          href="/patient/treatment"
          className="card-flush mt-2 flex items-center gap-3 border-2 border-sage-deep bg-card p-3"
        >
          <span className="grid size-10 flex-shrink-0 place-items-center rounded-[10px] bg-sage-tint text-sage-deep">
            <Icon.Protocol size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold">
              {patient.protocols[0].name}
            </p>
            <p className="truncate text-[11.5px] text-ink-faint">
              {patient.protocols[0].steps.filter((s) => s.done).length} of{" "}
              {patient.protocols[0].steps.length} done · reviewed monthly
            </p>
          </div>
          <span className="chip chip-sage flex-shrink-0">
            {patient.protocols[0].steps.filter((s) => s.done).length}/
            {patient.protocols[0].steps.length}
          </span>
        </Link>
      )}

      <div className="mt-5 flex items-center justify-between">
        <h2 className="font-serif text-[17px]">Active prescriptions</h2>
        <Link href="/patient/scripts" className="text-[12px] font-semibold text-sage-deep">
          All scripts →
        </Link>
      </div>
      <Link href="/patient/scripts" className="card-flush mt-2 flex items-center gap-3 p-3">
        <span className="grid size-9 flex-shrink-0 place-items-center rounded-md bg-navy-tint text-navy">
          <Icon.Pill size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold">
            {patient.prescriptions.length} active script
            {patient.prescriptions.length === 1 ? "" : "s"}
          </p>
          <p className="truncate text-[11.5px] text-ink-faint">
            {patient.prescriptions.map((rx) => rx.drug.split(" ").slice(0, 2).join(" ")).join(" · ")}
          </p>
        </div>
        <Icon.ChevronRight size={14} className="text-ink-faint" />
      </Link>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="font-serif text-[17px]">Tracked lesions</h2>
        <Link href="/patient/body" className="text-[12px] font-semibold text-sage-deep">
          Body map →
        </Link>
      </div>
      <div className="card-flush mt-2 overflow-hidden">
        {patient.lesions.map((l, i) => {
          const photo = l.timeline[l.timeline.length - 1];
          if (!photo) return null;
          return (
            <Link
              key={l.id}
              href={`/patient/lesions/${l.num}` as const}
              className={`flex items-center gap-3 p-3 transition hover:bg-paper ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <span
                className={`lnum ${
                  l.status === "active" ? "active" : l.status === "resolved" ? "resolved" : ""
                }`}
              >
                L{l.num}
              </span>
              <SkinPhoto
                spec={photo.spec}
                size="square"
                rounded="md"
                className="size-[44px]"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold">{l.region}</p>
                <p className="truncate text-[11.5px] text-ink-faint">
                  {l.type} · {photo.label}
                </p>
              </div>
              {l.status === "active" ? (
                <span className="trend up">Review</span>
              ) : delta < 0 ? (
                <span className="trend down">↓ Smaller</span>
              ) : (
                <span className="trend flat">Stable</span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-5">
        <h2 className="font-serif text-[17px]">Today’s check-in</h2>
        <div className="card mt-2">
          <p className="text-[12.5px] font-semibold">How itchy is your skin right now?</p>
          <div className="mt-2 flex gap-1.5">
            {[0, 2, 4, 6, 8, 10].map((n) => {
              const on = itch === n;
              const warn = n >= 6;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setItch(n)}
                  className={`flex-1 aspect-square rounded-[9px] border text-[13px] font-semibold transition ${
                    on
                      ? warn
                        ? "border-clay bg-clay text-white"
                        : "border-navy bg-navy text-white"
                      : "border-line bg-card text-ink-faint"
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => toast("Check-in saved · streak: 6 days")}
            className="btn mt-3 w-full"
          >
            Save today’s check-in
          </button>
        </div>
      </div>
      <p className="mt-6 text-center text-[11px] leading-relaxed text-ink-faint">
        DermaTrack is a tracking tool, not a diagnosis.
        <br />
        Always follow your care team’s advice.
      </p>
    </div>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div className="rounded-[12px] border border-line bg-card px-3 py-2.5">
      <p className="font-serif text-[20px] leading-none text-navy">{v}</p>
      <p className="mt-1 text-[10px] text-ink-faint">{l}</p>
    </div>
  );
}
