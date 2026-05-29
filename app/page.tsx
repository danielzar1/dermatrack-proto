"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icons";
import { setDemoRole } from "@/lib/demo/role";

/**
 * Cover / landing page. Founder-story framing for the interview demo —
 * sets the product vision before the role-pick. No real auth; the role
 * buttons drop the user straight into the clinician or patient shell.
 */
export default function CoverPage() {
  const router = useRouter();

  const enterAs = (role: "clinician" | "patient") => {
    setDemoRole(role);
    router.push(role === "clinician" ? "/clinician" : "/patient");
  };

  const startTour = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("dermatrack.tour.start", "1");
    }
    setDemoRole("clinician");
    router.push("/clinician");
  };

  return (
    <main className="min-h-dvh">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-10 md:py-14 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:px-12 lg:py-20">
        {/* Left — founder story */}
        <section className="flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <span
              className="grid size-12 place-items-center rounded-[15px] text-white"
              style={{ background: "linear-gradient(145deg,#2c4d78,#15273f)" }}
              aria-hidden
            >
              <Icon.Heart size={22} />
            </span>
            <div>
              <p className="font-serif text-[24px] leading-none text-navy-deep">DermaTrack</p>
              <p className="mt-1 text-[10.5px] uppercase tracking-[0.14em] text-sage-deep">
                Skin, tracked over time
              </p>
            </div>
          </div>

          <h1 className="mt-10 max-w-xl font-serif text-[44px] leading-[1.05] text-navy-deep md:text-[56px]">
            Dermatology is visual.
            <br />
            And it lives in the
            <br />
            <span className="text-clay">spaces between visits.</span>
          </h1>

          <p className="mt-7 max-w-lg text-[16px] leading-relaxed text-ink-soft">
            DermaTrack closes that gap. Patients take serial skin photos and log
            symptoms from home; clinicians review, compare, code and prescribe
            from one continuous record &mdash; with measurable severity
            tracking and audited access throughout. Built for South African
            practice and the POPI Act, from the ground up.
          </p>

          <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
            <Stat v="POPIA" l="aware, audited at the data layer" />
            <Stat v="Serial" l="photography is the killer feature" />
            <Stat v="Shared" l="record between patient & clinician" />
          </div>

          <p className="mt-10 max-w-md text-[13px] leading-relaxed text-ink-faint">
            <span className="font-semibold text-ink-soft">Conceived by Dr Jenna</span>
            , dermatologist &mdash; built around how care actually happens
            between visits.
          </p>
        </section>

        {/* Right — role select */}
        <section className="flex flex-col justify-center">
          <div className="card relative overflow-hidden p-7 md:p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 size-[260px] rounded-full opacity-50"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(33,58,92,0.18), transparent 70%)",
              }}
            />
            <p className="eyebrow">Prototype web app</p>
            <h2 className="mt-2 font-serif text-[28px] text-navy-deep">
              Step into the demo
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
              Two views of one system. Pick a side &mdash; the patient app or
              the clinician workspace &mdash; or run the guided tour for the
              two-minute story.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => enterAs("clinician")}
                className="group flex items-center justify-between gap-3 rounded-[15px] border border-navy bg-navy px-5 py-4 text-left text-white transition hover:bg-navy-deep"
              >
                <span className="flex items-center gap-3">
                  <span
                    className="grid size-9 place-items-center rounded-[10px] bg-white/12 text-white"
                    aria-hidden
                  >
                    <Icon.Eye size={18} />
                  </span>
                  <span>
                    <span className="block font-semibold">Continue as Clinician</span>
                    <span className="block text-[12px] text-white/70">
                      Triage queue · patient detail · dermoscopy · prescribing
                    </span>
                  </span>
                </span>
                <Icon.ChevronRight size={18} />
              </button>

              <button
                type="button"
                onClick={() => enterAs("patient")}
                className="group flex items-center justify-between gap-3 rounded-[15px] border border-line bg-card px-5 py-4 text-left text-navy transition hover:bg-navy-tint"
              >
                <span className="flex items-center gap-3">
                  <span
                    className="grid size-9 place-items-center rounded-[10px] bg-sage-tint text-sage-deep"
                    aria-hidden
                  >
                    <Icon.Heart size={18} />
                  </span>
                  <span>
                    <span className="block font-semibold">Continue as Patient</span>
                    <span className="block text-[12px] text-ink-faint">
                      Serial photos · treatment plan · data rights
                    </span>
                  </span>
                </span>
                <Icon.ChevronRight size={18} className="text-ink-faint" />
              </button>

              <button
                type="button"
                onClick={startTour}
                className="group mt-2 flex items-center justify-between gap-3 rounded-[15px] border border-dashed border-line bg-paper/60 px-5 py-4 text-left text-ink-soft transition hover:border-sage-deep hover:bg-sage-tint/40 hover:text-sage-deep"
              >
                <span className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-[10px] bg-sage-tint text-sage-deep" aria-hidden>
                    <Icon.Sparkle size={18} />
                  </span>
                  <span>
                    <span className="block font-semibold">Take the guided tour</span>
                    <span className="block text-[12px] text-ink-faint">
                      Narrated walk-through · ~3 minutes
                    </span>
                  </span>
                </span>
                <Icon.ChevronRight size={18} />
              </button>
            </div>

            <p className="mt-6 border-t border-line pt-4 text-[11px] leading-relaxed text-ink-faint">
              Concept prototype. All patients, IDs, photos and clinical detail
              are synthetic &mdash; no real personal information is stored or
              transmitted. Protected under the POPI Act, 2013.{" "}
              <Link href="/login" className="text-sage-deep underline">
                Real sign-in
              </Link>{" "}
              · <span className="underline-offset-2">Privacy</span>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div className="rounded-[12px] border border-line bg-card/70 px-3.5 py-3">
      <p className="font-serif text-[20px] leading-none text-navy">{v}</p>
      <p className="mt-1.5 text-[10.5px] leading-snug text-ink-faint">{l}</p>
    </div>
  );
}
