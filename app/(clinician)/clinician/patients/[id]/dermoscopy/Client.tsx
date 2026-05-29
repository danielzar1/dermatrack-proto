"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useMemo, useState } from "react";
import { getPatient } from "@/lib/mock/patients";
import { SkinPhoto } from "@/components/SkinPhoto";
import { Icon } from "@/components/Icons";
import { useToast } from "@/components/Toaster";
import { PhotoLightbox } from "@/components/PhotoLightbox";
import { ComparisonSlider } from "@/components/ComparisonSlider";

/**
 * Melanoma triage / dermoscopy view. Side-by-side macro + dermoscopic
 * imagery, ABCDE scorecard with individual sub-scores, total risk and
 * fast-track action. Patient must have a `suspicious` lesion (e.g.
 * Pieter van Wyk in the demo roster).
 */

type AbcdeKey = "A" | "B" | "C" | "D" | "E";

const ABCDE: Array<{ key: AbcdeKey; label: string; full: string; help: string }> = [
  {
    key: "A",
    label: "Asymmetry",
    full: "Asymmetry",
    help: "Two halves not mirror images when bisected on any axis.",
  },
  {
    key: "B",
    label: "Border",
    full: "Border irregularity",
    help: "Notched, scalloped, ragged or poorly defined edges.",
  },
  {
    key: "C",
    label: "Colour",
    full: "Colour variation",
    help: "Multiple shades (≥2): brown, black, red, white, blue.",
  },
  {
    key: "D",
    label: "Diameter",
    full: "Diameter ≥ 6 mm",
    help: "Most melanomas exceed 6 mm — but small melanomas exist.",
  },
  {
    key: "E",
    label: "Evolving",
    full: "Evolution",
    help: "Change in size, shape, colour, surface, symptoms over time.",
  },
];

export function DermoscopyClient({ id }: { id: string }) {
  const patient = getPatient(id);
  if (!patient) notFound();

  const lesion = patient.lesions.find((l) => l.status === "suspicious") ?? patient.lesions[0];
  if (!lesion) notFound();

  // Pick the LATEST macro (today's photo) — the earliest pigmented photo
  // is the patient's phone snap from 3 months ago, used only for "then vs
  // now". ABCDE should score against today.
  const macro = useMemo(() => {
    const pigments = lesion.timeline.filter((p) => p.spec.variant === "pigmented");
    return pigments[pigments.length - 1] ?? lesion.timeline[0];
  }, [lesion]);
  const dermo = useMemo(
    () => lesion.timeline.find((p) => p.spec.variant === "dermoscopy") ?? lesion.timeline[lesion.timeline.length - 1],
    [lesion],
  );
  const baseline = lesion.timeline[0];

  // Initialise ABCDE flags from the suspicious lesion's spec.
  const [scores, setScores] = useState<Record<AbcdeKey, boolean>>({
    A: (macro?.spec.asymmetry ?? 0) > 0.5,
    B: (macro?.spec.borderIrregularity ?? 0) > 0.5,
    C: (macro?.spec.pigmentVariance ?? 0) > 0.5,
    D: (macro?.spec.size ?? 0) > 0.4,
    E: true, // evolution captured by the timeline diff
  });

  const total = (Object.values(scores) as boolean[]).filter(Boolean).length;
  const risk =
    total >= 4 ? "high" : total === 3 ? "moderate" : total === 2 ? "low-moderate" : "low";

  const riskCopy: Record<typeof risk, { tone: "clay" | "navy" | "sage"; label: string; advice: string }> = {
    high: {
      tone: "clay",
      label: "HIGH",
      advice:
        "Fast-track for excision biopsy this week. Consider 2 mm margins for diagnostic excision; widen at re-excision per Breslow.",
    },
    moderate: {
      tone: "clay",
      label: "MODERATE",
      advice:
        "Excision biopsy within 2 weeks. Photograph and dermoscope at follow-up if biopsy not yet performed.",
    },
    "low-moderate": {
      tone: "navy",
      label: "LOW-MODERATE",
      advice: "Short-interval dermoscopic review (4–8 weeks). Consider biopsy if evolving.",
    },
    low: {
      tone: "sage",
      label: "LOW",
      advice: "Routine surveillance; patient-led ABCDE check between visits.",
    },
  };

  const { toast } = useToast();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[1280px] px-6 pb-16 pt-6 md:px-10">
        <Link
          href={`/clinician/patients/${patient.id}` as const}
          className="inline-flex items-center gap-1.5 text-[13px] text-ink-soft hover:text-navy"
        >
          <Icon.ChevronLeft size={15} />
          Back to {patient.name}
        </Link>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Pigmented-lesion triage</p>
            <h1 className="mt-1 font-serif text-[32px] text-navy-deep">
              ABCDE + dermoscopy
            </h1>
            <p className="mt-1 text-[14px] text-ink-soft">
              {patient.name} · L{lesion.num} · {lesion.region}
            </p>
          </div>
          <span
            className={`rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] ${
              riskCopy[risk].tone === "clay"
                ? "bg-clay text-white"
                : riskCopy[risk].tone === "navy"
                  ? "bg-navy text-white"
                  : "bg-sage-deep text-white"
            }`}
          >
            Risk: {riskCopy[risk].label} · {total}/5
          </span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left — imagery */}
          <section className="space-y-5">
            <div className="card">
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="font-serif text-[20px] text-navy-deep">Imagery</h2>
                <span className="text-[12px] text-ink-faint">
                  Macro + polarised dermoscopy
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {macro && (
                  <button
                    type="button"
                    className="relative text-left"
                    onClick={() =>
                      setLightboxIdx(lesion.timeline.findIndex((p) => p === macro))
                    }
                    aria-label="Zoom macro photo"
                  >
                    <SkinPhoto spec={macro.spec} size="hero" rounded="md" />
                    <span className="absolute left-2.5 top-2.5 rounded-md bg-[rgba(17,22,29,0.78)] px-2.5 py-1 text-[11px] font-semibold text-white">
                      Macro
                    </span>
                    <span className="absolute right-2.5 top-2.5 grid size-7 place-items-center rounded-md bg-[rgba(17,22,29,0.5)] text-white">
                      <Icon.ZoomIn size={13} />
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 rounded-md bg-[rgba(17,22,29,0.78)] px-2 py-1 text-[10.5px] text-white">
                      {macro.date}
                    </span>
                  </button>
                )}
                {dermo && (
                  <button
                    type="button"
                    className="relative text-left"
                    onClick={() =>
                      setLightboxIdx(lesion.timeline.findIndex((p) => p === dermo))
                    }
                    aria-label="Zoom dermoscopy photo"
                  >
                    <SkinPhoto spec={dermo.spec} size="hero" rounded="md" />
                    <span className="absolute left-2.5 top-2.5 rounded-md bg-[rgba(17,22,29,0.78)] px-2.5 py-1 text-[11px] font-semibold text-white">
                      Dermoscopy · 10×
                    </span>
                    <span className="absolute right-2.5 top-2.5 grid size-7 place-items-center rounded-md bg-[rgba(17,22,29,0.5)] text-white">
                      <Icon.ZoomIn size={13} />
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 rounded-md bg-[rgba(17,22,29,0.78)] px-2 py-1 text-[10.5px] text-white">
                      Atypical pigment network
                    </span>
                  </button>
                )}
              </div>

              {baseline && macro && baseline !== macro && (
                <div className="mt-5">
                  <p className="eyebrow">Evolution · drag to compare</p>
                  <ComparisonSlider
                    before={baseline}
                    after={macro}
                    beforeLabel="3 mo ago"
                    afterLabel="Today"
                    className="mt-2"
                  />
                  <p className="mt-2 text-[12.5px] text-ink-soft">
                    The lesion has grown, darkened and developed colour
                    heterogeneity over 3 months — change over time is the
                    strongest single risk feature in non-physician detection.
                  </p>
                </div>
              )}
            </div>

            {lesion.clinicianNote && (
              <div className="card border-clay/60 bg-clay-tint/30">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#9a4a26]">
                  <Icon.Alert size={14} />
                  Clinical note · {lesion.clinicianNoteAuthor} · {lesion.clinicianNoteWhen}
                </div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#7a3b1f]">
                  {lesion.clinicianNote}
                </p>
              </div>
            )}
          </section>

          {/* Right — ABCDE scorecard + action */}
          <aside className="space-y-4">
            <div className="card">
              <h2 className="font-serif text-[20px] text-navy-deep">ABCDE scorecard</h2>
              <p className="mt-1 text-[12px] text-ink-soft">
                Tap each criterion to toggle. Score is computed in real time.
              </p>
              <div className="mt-3 space-y-2">
                {ABCDE.map((row) => {
                  const on = scores[row.key];
                  return (
                    <button
                      type="button"
                      key={row.key}
                      onClick={() => setScores({ ...scores, [row.key]: !on })}
                      className={`flex w-full items-start gap-3 rounded-[12px] border p-3 text-left transition ${
                        on
                          ? "border-clay/70 bg-clay-tint/40"
                          : "border-line bg-card hover:bg-paper"
                      }`}
                    >
                      <span
                        className={`grid size-9 flex-shrink-0 place-items-center rounded-lg font-serif text-[18px] font-semibold ${
                          on
                            ? "bg-clay text-white"
                            : "bg-paper text-ink-soft"
                        }`}
                      >
                        {row.key}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] font-semibold leading-tight">
                          {row.full}
                        </p>
                        <p className="mt-0.5 text-[11.5px] leading-snug text-ink-faint">
                          {row.help}
                        </p>
                      </div>
                      <span
                        className={`grid size-6 flex-shrink-0 place-items-center rounded-md ${
                          on ? "bg-clay text-white" : "border border-line text-ink-faint"
                        }`}
                      >
                        {on ? <Icon.Check size={13} strokeWidth={3} /> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                <span className="text-[12px] text-ink-faint">Total score</span>
                <span className="font-serif text-[28px] text-clay">
                  {total}<span className="text-[16px] text-ink-faint"> / 5</span>
                </span>
              </div>
            </div>

            <div
              className={`rounded-[15px] border p-4 ${
                riskCopy[risk].tone === "clay"
                  ? "border-clay/70 bg-clay-tint/40"
                  : riskCopy[risk].tone === "navy"
                    ? "border-navy/40 bg-navy-tint"
                    : "border-sage-deep/40 bg-sage-tint"
              }`}
            >
              <p className="eyebrow">Recommended action</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink">
                {riskCopy[risk].advice}
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <button
                  type="button"
                  className="btn btn-clay"
                  onClick={() => toast("Excision biopsy booked · Wed 21 May 08:00")}
                >
                  <Icon.Send size={15} />
                  Fast-track excision
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => toast("Letter drafted to surgical oncology")}
                >
                  Refer to surgical oncology
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="font-serif text-[17px] text-navy-deep">Patient counselling</h3>
              <ul className="mt-2 space-y-1.5 text-[12.5px] text-ink-soft">
                <li>· Daily ABCDE self-check between visits</li>
                <li>· Photograph any new or changing mole</li>
                <li>· Strict photoprotection on operated skin</li>
                <li>· Sentinel-node discussion if Breslow ≥ 0.8 mm</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
      {lightboxIdx != null && (
        <PhotoLightbox
          photos={lesion.timeline}
          startIndex={lightboxIdx}
          title={`Pigmented-lesion triage · L${lesion.num}`}
          subtitle={lesion.region}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </div>
  );
}
