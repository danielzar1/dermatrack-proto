"use client";

import { useState } from "react";
import type { Patient } from "@/lib/mock/types";
import { Icon } from "@/components/Icons";

/**
 * Prescribing sheet — three-step compact flow: pick drug → set dose &
 * signa → preview & send. Safety checks (allergies, interactions) are
 * surfaced inline. All choices are local state only; in production this
 * writes to `prescriptions` via the audited DAL.
 */

type Drug = {
  name: string;
  strength: string;
  schedule: string;
  form: string;
  defaultSigna: string;
  defaultQty: string;
  /** Lower-case allergy / med substrings that should warn. */
  warnIf?: string[];
};

const COMMON_DRUGS: Drug[] = [
  {
    name: "Clobetasol propionate",
    strength: "0.05% ointment",
    schedule: "S4",
    form: "ointment",
    defaultSigna: "Apply twice daily to affected areas for 2 weeks",
    defaultQty: "30 g",
  },
  {
    name: "Mometasone furoate",
    strength: "0.1% cream",
    schedule: "S4",
    form: "cream",
    defaultSigna: "Apply once daily to affected areas",
    defaultQty: "30 g",
  },
  {
    name: "Tacrolimus",
    strength: "0.1% ointment",
    schedule: "S4",
    form: "ointment",
    defaultSigna: "Apply twice daily to affected areas",
    defaultQty: "30 g",
  },
  {
    name: "Hydroxyzine",
    strength: "25 mg tablets",
    schedule: "S2",
    form: "tablet",
    defaultSigna: "1 tablet at night for itch",
    defaultQty: "30 tablets",
  },
  {
    name: "Cetirizine",
    strength: "10 mg tablets",
    schedule: "S2",
    form: "tablet",
    defaultSigna: "1 tablet daily",
    defaultQty: "30 tablets",
  },
  {
    name: "Methotrexate",
    strength: "2.5 mg tablets",
    schedule: "S4",
    form: "tablet",
    defaultSigna: "6 tablets once weekly + folic acid 5 mg the next day",
    defaultQty: "30 tablets",
  },
  {
    name: "Isotretinoin",
    strength: "20 mg capsules",
    schedule: "S4",
    form: "capsule",
    defaultSigna:
      "1 capsule daily with food. Pregnancy prevention if applicable. Monthly bloods and mood check.",
    defaultQty: "30 capsules",
  },
  {
    name: "Hydroxychloroquine",
    strength: "200 mg tablets",
    schedule: "S3",
    form: "tablet",
    defaultSigna: "1 tablet twice daily with food",
    defaultQty: "60 tablets",
  },
  {
    name: "Amoxicillin",
    strength: "500 mg capsules",
    schedule: "S4",
    form: "capsule",
    defaultSigna: "1 capsule three times daily for 7 days",
    defaultQty: "21 capsules",
    warnIf: ["penicillin", "amoxicillin"],
  },
];

type Props = {
  patient: Patient;
  onClose: () => void;
  onSent: () => void;
};

export function PrescribeSheet({ patient, onClose, onSent }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [q, setQ] = useState("");
  const [drug, setDrug] = useState<Drug | null>(null);
  const [signa, setSigna] = useState("");
  const [qty, setQty] = useState("");

  const results = COMMON_DRUGS.filter(
    (d) =>
      !q ||
      d.name.toLowerCase().includes(q.toLowerCase()) ||
      d.strength.toLowerCase().includes(q.toLowerCase()),
  );

  const allergyWarning =
    drug?.warnIf?.some((w) => patient.intake.allergies.toLowerCase().includes(w)) ?? false;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-3 sm:items-center">
      <div className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-[22px] bg-card shadow-[var(--shadow-lg)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <p className="eyebrow">Prescribe · step {step} of 3</p>
            <h2 className="font-serif text-[20px] text-navy-deep">
              {step === 1 && "Pick a medicine"}
              {step === 2 && "Dose & directions"}
              {step === 3 && "Review & send"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full text-ink-faint hover:bg-paper"
            aria-label="Close"
          >
            <Icon.X size={17} />
          </button>
        </div>

        {/* Steps progress */}
        <div className="flex gap-1.5 px-5 pt-3">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={`h-1 flex-1 rounded-full ${
                s < step
                  ? "bg-sage-deep"
                  : s === step
                    ? "bg-navy"
                    : "bg-line"
              }`}
            />
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {step === 1 && (
            <>
              <div className="relative">
                <Icon.Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
                />
                <input
                  autoFocus
                  className="input !pl-10"
                  placeholder="Search drug name…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <div className="card-flush mt-3 overflow-hidden">
                {results.map((d) => (
                  <button
                    type="button"
                    key={d.name + d.strength}
                    onClick={() => {
                      setDrug(d);
                      setSigna(d.defaultSigna);
                      setQty(d.defaultQty);
                      setStep(2);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-paper"
                  >
                    <span
                      className="grid size-8 flex-shrink-0 place-items-center rounded-md bg-navy-tint text-navy"
                    >
                      <Icon.Pill size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold">{d.name}</p>
                      <p className="truncate text-[11.5px] text-ink-faint">{d.strength}</p>
                    </div>
                    <span
                      className={`font-serif text-[12.5px] font-semibold ${
                        d.schedule === "S4" ? "text-[#9a4a26]" : "text-navy"
                      }`}
                    >
                      {d.schedule}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11.5px] text-ink-faint">
                Showing {results.length} of {COMMON_DRUGS.length} drugs loaded in the
                prototype. Real build pulls from the SA Medicines Code Master.
              </p>
            </>
          )}

          {step === 2 && drug && (
            <>
              <div className="rounded-[15px] border-2 border-sage-deep bg-card px-4 py-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-[15px] font-semibold">{drug.name}</p>
                    <p className="text-[11.5px] text-ink-faint">{drug.strength}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[12px] font-semibold text-sage-deep hover:underline"
                  >
                    Change
                  </button>
                </div>
              </div>

              {allergyWarning && (
                <div className="mt-3 flex items-start gap-2.5 rounded-[15px] border border-clay/70 bg-clay-tint/60 p-3 text-[12.5px] text-[#8a5238]">
                  <Icon.Alert size={16} />
                  <div>
                    <strong className="font-semibold">Allergy alert.</strong>{" "}
                    Patient lists “{patient.intake.allergies}”. Confirm before issuing.
                  </div>
                </div>
              )}

              <div className="mt-4">
                <label className="text-[12.5px] font-semibold text-ink-soft">
                  Signa (directions)
                </label>
                <textarea
                  className="input mt-1 min-h-[80px] resize-y"
                  value={signa}
                  onChange={(e) => setSigna(e.target.value)}
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12.5px] font-semibold text-ink-soft">Quantity</label>
                  <input
                    className="input mt-1"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[12.5px] font-semibold text-ink-soft">Schedule</label>
                  <input className="input mt-1" value={drug.schedule} readOnly />
                </div>
              </div>
            </>
          )}

          {step === 3 && drug && (
            <div className="card-flush p-5">
              <p className="eyebrow">Prescription preview</p>
              <h3 className="mt-1 font-serif text-[20px] text-navy-deep">
                {drug.name} {drug.strength}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink">{signa}</p>
              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-3 text-[12.5px]">
                <div>
                  <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">Quantity</dt>
                  <dd>{qty}</dd>
                </div>
                <div>
                  <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">Schedule</dt>
                  <dd>{drug.schedule}</dd>
                </div>
                <div>
                  <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">Patient</dt>
                  <dd>{patient.name} · {patient.folderNumber}</dd>
                </div>
                <div>
                  <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">Prescriber</dt>
                  <dd>Dr J Damelin · MP 123456</dd>
                </div>
              </dl>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-3 border-t border-line bg-paper/60 px-5 py-3">
          <button
            type="button"
            onClick={() => (step > 1 ? setStep((step - 1) as 1 | 2 | 3) : onClose())}
            className="btn btn-ghost"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          {step === 1 && (
            <button
              type="button"
              className="btn"
              disabled={!drug}
              onClick={() => setStep(2)}
              style={drug ? {} : { opacity: 0.5, cursor: "not-allowed" }}
            >
              Continue
            </button>
          )}
          {step === 2 && (
            <button type="button" className="btn" onClick={() => setStep(3)}>
              Preview
            </button>
          )}
          {step === 3 && (
            <button type="button" className="btn btn-sage" onClick={onSent}>
              <Icon.Send size={15} />
              Send to pharmacy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
