"use client";

import Link from "next/link";
import { useState } from "react";
import { patients } from "@/lib/mock/patients";
import { Icon } from "@/components/Icons";
import { useToast } from "@/components/Toaster";

export default function PatientTreatment() {
  const patient = patients[0]!;
  const proto = patient.protocols[0];
  const { toast } = useToast();
  const [steps, setSteps] = useState(proto ? proto.steps : []);

  if (!proto) {
    return (
      <p className="mt-10 text-center text-[14px] text-ink-faint">
        No treatment plan assigned yet.
      </p>
    );
  }

  const done = steps.filter((s) => s.done).length;
  const total = steps.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div>
      <Link
        href="/patient"
        className="inline-flex items-center gap-1.5 pt-2 text-[13px] text-ink-soft"
      >
        <Icon.ChevronLeft size={15} />
        Home
      </Link>

      <p className="eyebrow mt-2">Treatment protocol</p>
      <h1 className="mt-1 font-serif text-[24px] leading-tight">{proto.name}</h1>
      <p className="mt-2 text-[13px] text-ink-soft">{proto.summary}</p>

      <div className="card mt-4">
        <div className="flex items-baseline justify-between">
          <p className="text-[13px] font-semibold">Your progress</p>
          <p className="text-[12px] font-semibold text-sage-deep">
            {done} of {total} steps
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full border border-line bg-paper">
          <div
            className="h-full rounded-full bg-sage-deep transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {proto.surveillanceNote && (
        <div className="mt-3 rounded-[15px] border border-[#e6c3b0] bg-clay-tint/60 px-3.5 py-3 text-[12.5px] leading-relaxed text-[#8a5238]">
          <strong className="font-semibold">Skin-cancer surveillance.</strong>{" "}
          {proto.surveillanceNote}
        </div>
      )}

      <h2 className="mt-5 font-serif text-[17px]">Your checklist</h2>
      <div className="card-flush mt-2">
        {steps.map((s, i) => (
          <button
            type="button"
            key={i}
            onClick={() => {
              const next = [...steps];
              next[i] = { ...s, done: !s.done };
              setSteps(next);
              toast(s.done ? "Step un-checked" : "Step marked done");
            }}
            className={`flex w-full items-start gap-3 px-4 py-3 text-left ${
              i > 0 ? "border-t border-line" : ""
            }`}
          >
            <span
              className={`mt-0.5 grid size-6 flex-shrink-0 place-items-center rounded-md ${
                s.done ? "bg-sage-deep" : "border-2 border-line"
              }`}
            >
              {s.done && <Icon.Check size={13} strokeWidth={3} className="text-white" />}
            </span>
            <div>
              <p
                className={`text-[13px] leading-tight ${
                  s.done ? "text-ink-faint line-through" : ""
                }`}
              >
                {s.text}
              </p>
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                  s.due.toLowerCase().includes("this week")
                    ? "bg-clay-tint text-[#9a4a26]"
                    : "bg-navy-tint text-navy"
                }`}
              >
                {s.due}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
