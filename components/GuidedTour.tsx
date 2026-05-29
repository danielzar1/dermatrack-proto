"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "./Icons";
import { setDemoRole } from "@/lib/demo/role";

/**
 * Guided narrated tour. Lives in the root layout; auto-starts when the
 * cover page sets `sessionStorage["dermatrack.tour.start"] = "1"`, and is
 * also openable any time via a small floating button.
 *
 * Steps drive a route + caption card. The user clicks Next/Back/Exit.
 * No element highlighting (intentionally — keeps the tour robust to
 * layout changes); the caption tells the story.
 */

type Step = {
  route: string;
  title: string;
  body: string;
  cta?: string;
};

const STEPS: Step[] = [
  {
    route: "/clinician",
    title: "The clinician workspace",
    body:
      "Eight active patients today. One urgent — a GP-referred changing mole — and three follow-ups. We'll open them in order.",
    cta: "Show me the urgent one",
  },
  {
    route: "/clinician/patients/pt-pvw",
    title: "Pieter van Wyk · pigmented-lesion referral",
    body:
      "Whole record on one page. Pre-consult intake on the left; body map in the middle; quick actions on the right. The lesion is tagged 'suspicious' — let's triage it.",
    cta: "Open dermoscopy",
  },
  {
    route: "/clinician/patients/pt-pvw/dermoscopy",
    title: "ABCDE + dermoscopy",
    body:
      "Macro + polarised dermoscopy side-by-side. ABCDE scored live — 4 of 5 here. Risk is HIGH. The action card books a fast-track excision biopsy in one tap.",
    cta: "Back to the queue",
  },
  {
    route: "/clinician",
    title: "Now the follow-up story",
    body:
      "Hadassah Friedman — 81, cutaneous T-cell lymphoma on NB-UVB phototherapy. The hero longitudinal case.",
    cta: "Open Hadassah",
  },
  {
    route: "/clinician/patients/pt-hf",
    title: "Serial photography is the killer feature",
    body:
      "L1 left upper back — four timepoints, three months apart. The plaque visibly shrinks and fades. The mSWAT severity score on the chart confirms it: 22 down to 9.",
    cta: "Issue today's script",
  },
  {
    route: "/clinician/patients/pt-hf",
    title: "Prescribe in three taps",
    body:
      "Click 'Prescribe' on the right. SA drug schedule aware (S0–S6), allergy-checked against the intake. Signa is the only free text. Send goes to the pharmacy.",
    cta: "Switch to the patient side",
  },
  {
    route: "/patient",
    title: "The patient's view of the same record",
    body:
      "On the desktop we show the patient app in a phone frame — that's what Hadassah opens between visits. Same data; her side. Trending calmer.",
    cta: "Open her body map",
  },
  {
    route: "/patient/body",
    title: "She tracks her own lesions",
    body:
      "Tap a numbered badge to see that lesion's photo timeline. The red one needs review — that's the alert flowing back from Dr Damelin.",
    cta: "Open L1's timeline",
  },
  {
    route: "/patient/lesions/1",
    title: "Then vs now, in her pocket",
    body:
      "Her clinician's note sits next to the photo strip. New-photo prompts use a faint ghost of the previous shot so the framing matches.",
    cta: "Show her data rights",
  },
  {
    route: "/patient/data",
    title: "POPIA, woven through",
    body:
      "Access log, corrections, consent management, data export, account delete, Information Officer contact. The hard gate: no real patient PHI until SA data residency is resolved.",
    cta: "End the tour",
  },
];

const TOUR_FLAG = "dermatrack.tour.start";

export function GuidedTour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const path = usePathname();

  // Auto-start when cover page requests it
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem(TOUR_FLAG) === "1") {
        window.sessionStorage.removeItem(TOUR_FLAG);
        setActive(true);
        setStep(0);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function go(toStep: number) {
    const s = STEPS[toStep];
    if (!s) return;
    setStep(toStep);
    // Set role appropriately when crossing app boundary
    if (s.route.startsWith("/clinician")) setDemoRole("clinician");
    else if (s.route.startsWith("/patient")) setDemoRole("patient");
    if (s.route !== path) router.push(s.route);
  }

  function startFresh() {
    setActive(true);
    setCollapsed(false);
    go(0);
  }

  // Floating launcher (always available). Bumped up on phone-frame
  // routes so it doesn't sit on top of the patient bottom nav.
  const isPatient = path.startsWith("/patient");
  const launcher = !active && (
    <button
      type="button"
      onClick={startFresh}
      className={`fixed left-4 z-[88] flex items-center gap-2 rounded-full bg-navy px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-[var(--shadow-lg)] transition hover:bg-navy-deep ${
        isPatient ? "bottom-[88px] lg:bottom-5" : "bottom-4"
      }`}
    >
      <Icon.Sparkle size={14} />
      Guided tour
    </button>
  );

  if (!active) return <>{launcher}</>;

  const current = STEPS[step]!;
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="fixed bottom-5 left-5 z-[95] flex items-center gap-2 rounded-full bg-navy px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-[var(--shadow-lg)]"
      >
        <Icon.Sparkle size={14} />
        Resume tour · {step + 1}/{STEPS.length}
      </button>
    );
  }

  return (
    <div className="tour-card" role="dialog" aria-label="Guided tour">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="eyebrow">
            Step {step + 1} of {STEPS.length}
          </p>
          <h3 className="mt-1 font-serif text-[18px] leading-snug text-navy-deep">
            {current.title}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="grid size-7 flex-shrink-0 place-items-center rounded-full text-ink-faint hover:bg-paper"
          aria-label="Minimise tour"
          title="Minimise"
        >
          <Icon.ChevronLeft size={14} />
        </button>
        <button
          type="button"
          onClick={() => setActive(false)}
          className="grid size-7 flex-shrink-0 place-items-center rounded-full text-ink-faint hover:bg-paper"
          aria-label="Exit tour"
          title="Exit"
        >
          <Icon.X size={14} />
        </button>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{current.body}</p>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(step - 1)}
          disabled={isFirst}
          className="btn btn-ghost !py-2 !text-[12px]"
          style={isFirst ? { opacity: 0.5, cursor: "not-allowed" } : {}}
        >
          Back
        </button>
        <div className="mx-1 flex flex-1 gap-1">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i < step ? "bg-sage-deep" : i === step ? "bg-navy" : "bg-line"
              }`}
            />
          ))}
        </div>
        {isLast ? (
          <button
            type="button"
            onClick={() => setActive(false)}
            className="btn btn-sage !py-2 !text-[12.5px]"
          >
            <Icon.Check size={13} />
            Finish
          </button>
        ) : (
          <button
            type="button"
            onClick={() => go(step + 1)}
            className="btn !py-2 !text-[12.5px]"
          >
            {current.cta ?? "Next"}
            <Icon.ChevronRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
