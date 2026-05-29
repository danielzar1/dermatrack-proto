"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { patients } from "@/lib/mock/patients";
import type { Patient } from "@/lib/mock/types";
import { Icon } from "@/components/Icons";
import { SkinPhoto } from "@/components/SkinPhoto";
import { useToast } from "@/components/Toaster";

// Demo "today" — aligned with the patient roster's photo timestamps.
const DEMO_TODAY = new Date("2026-05-19T08:00:00");
const DEMO_TODAY_LABEL = DEMO_TODAY.toLocaleDateString("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * Clinician dashboard. Desktop-first information-dense workspace:
 *  - Greeting + global search + add-patient
 *  - 4-up stat tiles
 *  - Two-column grid: triage queue (left) + activity rail (right)
 *  - Compact "all patients" table at the foot
 */
export default function ClinicianDashboard() {
  const [q, setQ] = useState("");
  const { toast } = useToast();

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return patients;
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.code.toLowerCase().includes(needle) ||
        p.folderNumber.toLowerCase().includes(needle) ||
        p.confirmed.some((d) => d.name.toLowerCase().includes(needle)) ||
        p.differential.some((d) => d.name.toLowerCase().includes(needle)),
    );
  }, [q]);

  const review = filtered.filter((p) => p.urgency !== "routine");
  const routine = filtered.filter((p) => p.urgency === "routine");

  const stats = {
    active: patients.length,
    review: patients.filter((p) => p.urgency === "review").length,
    urgent: patients.filter((p) => p.urgency === "urgent").length,
    onProto: patients.filter((p) => p.protocols.length > 0).length,
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[1280px] px-6 pb-16 pt-8 md:px-10">
        {/* Greeting + search */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{DEMO_TODAY_LABEL}</p>
            <h1 className="mt-1 font-serif text-[34px] leading-tight text-navy-deep">
              Good morning, Dr Damelin
            </h1>
            <p className="mt-1.5 text-[14.5px] text-ink-soft">
              You have{" "}
              <strong className="text-clay">
                {stats.urgent} urgent
              </strong>{" "}
              and{" "}
              <strong className="text-navy">
                {stats.review} review
              </strong>{" "}
              patient{stats.review + stats.urgent === 1 ? "" : "s"} waiting.
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <div className="relative min-w-0 flex-1 sm:flex-initial">
              <Icon.Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
              />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search patients…"
                className="input w-full !pl-10 sm:w-[300px]"
              />
            </div>
            <button
              type="button"
              className="btn !px-3 sm:!px-4"
              onClick={() => toast("Add-patient wizard — coming next slice")}
            >
              <Icon.Add size={15} />
              <span className="hidden sm:inline">Add patient</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="stat">
            <p className="v">{stats.active}</p>
            <p className="l">Active patients</p>
          </div>
          <div className="stat">
            <p className="v" style={{ color: "var(--color-clay)" }}>{stats.review}</p>
            <p className="l">Awaiting review</p>
          </div>
          <div className="stat">
            <p className="v" style={{ color: "var(--color-clay)" }}>{stats.urgent}</p>
            <p className="l">Urgent flags</p>
          </div>
          <div className="stat">
            <p className="v">{stats.onProto}</p>
            <p className="l">On protocols</p>
          </div>
        </div>

        {/* Today's priorities — derived from the roster */}
        <PrioritiesCard />

        {/* Two-col */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <section>
            <div className="section-h">
              <h2>Awaiting your review</h2>
              <span className="text-[12.5px] text-ink-faint">
                {review.length} of {filtered.length}
              </span>
            </div>
            <div className="space-y-3">
              {review.length === 0 && (
                <p className="rounded-[15px] border border-dashed border-line bg-card/60 px-5 py-8 text-center text-[13px] text-ink-faint">
                  No patients awaiting review.
                </p>
              )}
              {review.map((p) => (
                <PatientReviewCard key={p.id} patient={p} />
              ))}
            </div>

            <div className="section-h">
              <h2>All patients</h2>
              <span className="text-[12.5px] text-ink-faint">
                {routine.length} routine
              </span>
            </div>
            <div className="card-flush overflow-hidden">
              {routine.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/clinician/patients/${p.id}` as const}
                  className={`flex items-center gap-4 px-5 py-3.5 transition hover:bg-paper/60 ${i > 0 ? "border-t border-line" : ""}`}
                >
                  <Avatar p={p} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14.5px] font-semibold">{p.name}</p>
                    <p className="truncate text-[12px] text-ink-faint">
                      {p.age} · {p.sex} · {dxLabel(p)}
                    </p>
                  </div>
                  <span className="hidden text-[11.5px] text-ink-faint md:inline">
                    {p.lastVisit}
                  </span>
                  <Icon.ChevronRight size={16} className="text-ink-faint" />
                </Link>
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <ScheduleCard />
            <ActivityCard />
            <QuickActionsCard />
          </aside>
        </div>
      </div>
    </div>
  );
}

function PatientReviewCard({ patient: p }: { patient: Patient }) {
  const lastLesion = p.lesions[0];
  const lastPhoto = lastLesion?.timeline[lastLesion.timeline.length - 1];
  const isUrgent = p.urgency === "urgent";

  return (
    <Link
      href={`/clinician/patients/${p.id}` as const}
      className={`group flex items-stretch gap-4 rounded-[15px] border bg-card p-4 transition hover:border-navy hover:shadow-card ${
        isUrgent ? "border-clay/70 bg-clay-tint/30" : "border-line"
      }`}
    >
      {lastLesion && lastPhoto && (
        <div className="flex-shrink-0">
          <SkinPhoto
            spec={lastPhoto.spec}
            size="square"
            rounded="md"
            className="size-[88px]"
          />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start gap-3">
          <Avatar p={p} size={36} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15.5px] font-semibold">{p.name}</p>
            <p className="truncate text-[12px] text-ink-faint">
              {p.age} · {p.sex} · {p.folderNumber}
            </p>
          </div>
          <span className={`badge-rev ${isUrgent ? "" : "!bg-navy-tint !text-navy-deep !border-[#c8d4e3]"}`}>
            {isUrgent ? "URGENT" : "Review"}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-[12.5px] text-ink-soft">
          {p.needsReviewReason}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <div className="flex flex-wrap gap-1.5">
            {dxChips(p).slice(0, 2).map((d, i) => (
              <span
                key={i}
                className={`dx-chip ${p.confirmed.find((c) => c.code === d.code) ? "confirmed" : "differential"}`}
              >
                <span className="dx-code">{d.code}</span>
                <span className="truncate">{d.name}</span>
              </span>
            ))}
            {p.protocols[0] && (
              <span className="chip chip-sage">{p.protocols[0].name}</span>
            )}
          </div>
          <span className="text-[12px] font-semibold text-sage-deep group-hover:underline">
            Open patient →
          </span>
        </div>
      </div>
    </Link>
  );
}

function Avatar({ p, size = 40 }: { p: Patient; size?: number }) {
  const isAlert = p.urgency !== "routine";
  return (
    <span
      className="grid flex-shrink-0 place-items-center rounded-full text-[12.5px] font-semibold"
      style={{
        width: size,
        height: size,
        background: isAlert ? "var(--color-clay-tint)" : "var(--color-paper)",
        color: isAlert ? "#9a4a26" : "var(--color-ink-soft)",
        border: isAlert ? "1px solid var(--color-clay)" : "1px solid var(--color-line)",
      }}
    >
      {p.code}
    </span>
  );
}

function dxChips(p: Patient) {
  return p.confirmed.length > 0 ? p.confirmed : p.differential;
}

function dxLabel(p: Patient): string {
  const first = (p.confirmed[0] ?? p.differential[0]);
  return first ? `${first.code} ${first.name}` : "—";
}

function ScheduleCard() {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-[18px]">Today’s schedule</h3>
        <Icon.Calendar size={16} className="text-ink-faint" />
      </div>
      <ul className="mt-3 space-y-3">
        {[
          { time: "08:30", who: "Pieter van Wyk", what: "Urgent · pigmented lesion", urgent: true },
          { time: "09:15", who: "Hadassah Friedman", what: "Follow-up · MF month 2" },
          { time: "10:00", who: "Moses Dlamini", what: "Cutaneous lupus review" },
          { time: "11:15", who: "Annelize Botha", what: "Drug eruption review" },
          { time: "14:00", who: "Refilwe Ndlovu", what: "Vitiligo — phototherapy" },
        ].map((s, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={`mt-0.5 inline-block rounded-md px-2 py-1 text-[11px] font-semibold ${
                s.urgent ? "bg-clay-tint text-[#9a4a26]" : "bg-navy-tint text-navy"
              }`}
            >
              {s.time}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold">{s.who}</p>
              <p className="truncate text-[11.5px] text-ink-faint">{s.what}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActivityCard() {
  const items = [
    { who: "HF", what: "uploaded a new photo of L1", when: "2h ago", tone: "navy" as const },
    { who: "AB", what: "logged 3 new spots", when: "5h ago", tone: "clay" as const },
    { who: "MD", what: "itch score 7/10", when: "yesterday", tone: "clay" as const },
    { who: "SK", what: "month-3 bloods filed", when: "yesterday", tone: "sage" as const },
  ];
  const dot: Record<string, string> = {
    navy: "bg-navy",
    clay: "bg-clay",
    sage: "bg-sage-deep",
  };
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-[18px]">Recent activity</h3>
        <Icon.Trend size={16} className="text-ink-faint" />
      </div>
      <ul className="mt-3 space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className={`mt-1.5 inline-block size-2 flex-shrink-0 rounded-full ${dot[it.tone]}`} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] leading-snug">
                <strong className="font-semibold">{it.who}</strong> {it.what}
              </p>
              <p className="text-[11px] text-ink-faint">{it.when}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PrioritiesCard() {
  // Derive priorities from the roster — the kind of thing a clinical
  // copilot would surface at start-of-day. Each is a real signal in the
  // mock data: urgency tag, severity trend, due protocol step.
  const urgent = patients.filter((p) => p.urgency === "urgent");
  const worsening = patients.filter((p) => {
    if (p.severityTrend.length < 2) return false;
    const last = p.severityTrend[p.severityTrend.length - 1]!;
    const prev = p.severityTrend[p.severityTrend.length - 2]!;
    return last.value > prev.value;
  });
  const dueSteps = patients
    .flatMap((p) =>
      p.protocols.flatMap((proto) =>
        proto.steps
          .filter(
            (s) =>
              !s.done &&
              (s.due.toLowerCase().includes("this week") ||
                s.due.toLowerCase().includes("due")),
          )
          .map((s) => ({ patient: p, step: s, proto })),
      ),
    )
    .slice(0, 3);

  const items: Array<{ icon: React.ReactNode; tone: string; head: string; body: string }> = [];
  for (const p of urgent) {
    items.push({
      tone: "clay",
      icon: <Icon.Alert size={13} />,
      head: `${p.name} · urgent`,
      body: `${p.needsReviewReason ?? p.confirmed[0]?.name ?? p.differential[0]?.name ?? ""}`,
    });
  }
  for (const p of worsening) {
    items.push({
      tone: "clay",
      icon: <Icon.Trend size={13} />,
      head: `${p.name} · worsening`,
      body: `${p.severityTrend[0]?.unit ?? "Severity"} trending up`,
    });
  }
  for (const ds of dueSteps) {
    items.push({
      tone: "navy",
      icon: <Icon.Check size={13} strokeWidth={2.5} />,
      head: `${ds.patient.name} · ${ds.proto.name}`,
      body: ds.step.text,
    });
  }
  // Estimated review time: 6 min per urgent, 4 per review, 2 per routine step
  const mins = urgent.length * 6 + worsening.length * 4 + dueSteps.length * 2;

  return (
    <div
      className="mt-6 rounded-[18px] border border-sage-deep/30 p-4 md:p-5"
      style={{
        background:
          "linear-gradient(135deg, rgba(221,231,219,0.55), rgba(255,255,255,0.4))",
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-full bg-sage-deep text-white">
            <Icon.Sparkle size={13} />
          </span>
          <div>
            <p className="eyebrow !text-sage-deep">Today’s clinical priorities</p>
            <p className="text-[12.5px] text-ink-soft">
              {items.length} signal{items.length === 1 ? "" : "s"} from the roster · ~{mins} min review
            </p>
          </div>
        </div>
        <span className="text-[11.5px] text-ink-faint">Auto-summarised</span>
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <li
            key={i}
            className="flex items-start gap-2 rounded-[12px] border border-line bg-card/70 px-3 py-2"
          >
            <span
              className={`mt-0.5 grid size-6 flex-shrink-0 place-items-center rounded-full ${
                it.tone === "clay"
                  ? "bg-clay-tint text-[#9a4a26]"
                  : "bg-navy-tint text-navy"
              }`}
            >
              {it.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold">{it.head}</p>
              <p className="line-clamp-2 text-[11.5px] text-ink-faint">{it.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuickActionsCard() {
  return (
    <div className="card">
      <h3 className="font-serif text-[18px]">Quick actions</h3>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link href={"/clinician/coding" as const} className="btn btn-ghost !py-3 !text-[12.5px]">
          <Icon.Code size={14} />
          ICD-10
        </Link>
        <Link href={"/clinician/audit" as const} className="btn btn-ghost !py-3 !text-[12.5px]">
          <Icon.Audit size={14} />
          Audit log
        </Link>
        <Link href={"/clinician/protocols" as const} className="btn btn-ghost !py-3 !text-[12.5px]">
          <Icon.Protocol size={14} />
          Protocols
        </Link>
        <Link href={"/patient" as const} className="btn btn-ghost !py-3 !text-[12.5px]">
          <Icon.Eye size={14} />
          Patient view
        </Link>
      </div>
    </div>
  );
}
