"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";
import { getPatient } from "@/lib/mock/patients";
import type { LesionPhoto, Patient } from "@/lib/mock/types";
import { BodyMap } from "@/components/BodyMap";
import { SkinPhoto } from "@/components/SkinPhoto";
import { SeverityChart } from "@/components/SeverityChart";
import { Icon } from "@/components/Icons";
import { useToast } from "@/components/Toaster";
import { PrescribeSheet } from "./PrescribeSheet";
import { IcdSheet } from "./IcdSheet";
import { PhotoLightbox } from "@/components/PhotoLightbox";
import { ComparisonSlider } from "@/components/ComparisonSlider";

/**
 * Patient detail — the clinician hero screen. Three-column desktop
 * layout: patient summary (left), interactive body-map + lesion timeline
 * + severity chart (centre), quick actions + plans + audit (right).
 *
 * Routes in `/clinician/patients/[id]/dermoscopy` for the ABCDE triage
 * flow when a lesion is `suspicious`.
 */
export function PatientDetailClient({ id }: { id: string }) {
  const patient = getPatient(id);
  if (!patient) notFound();
  return <PatientDetailInner patient={patient} />;
}

function PatientDetailInner({ patient }: { patient: Patient }) {
  const router = useRouter();
  const { toast } = useToast();

  const initialLesion =
    patient.lesions.find((l) => l.status === "suspicious") ??
    patient.lesions.find((l) => l.status === "active") ??
    patient.lesions[0];

  const [selLesionId, setSelLesionId] = useState<string | undefined>(initialLesion?.id);
  const selLesion = patient.lesions.find((l) => l.id === selLesionId) ?? initialLesion;

  const [selPhotoIdx, setSelPhotoIdx] = useState<number>(
    selLesion ? Math.max(0, selLesion.timeline.length - 1) : 0,
  );
  const selPhoto: LesionPhoto | undefined = selLesion?.timeline[selPhotoIdx];
  const baselinePhoto = selLesion?.timeline[0];

  const [showRx, setShowRx] = useState(false);
  const [showIcd, setShowIcd] = useState<null | "differential" | "confirmed">(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [cmpMode, setCmpMode] = useState<"side" | "slider">("slider");

  const [diffDx, setDiffDx] = useState(patient.differential);
  const [confDx, setConfDx] = useState(patient.confirmed);

  function addDx(bucket: "differential" | "confirmed", code: string, name: string) {
    const arr = bucket === "confirmed" ? confDx : diffDx;
    if (arr.some((d) => d.code === code)) {
      toast(`${code} already added`);
      return;
    }
    const next = [...arr, { code, name }];
    if (bucket === "confirmed") setConfDx(next);
    else setDiffDx(next);
    toast(`Added ${code} to ${bucket}`);
  }

  const isSuspicious = patient.lesions.some((l) => l.status === "suspicious");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[1440px] px-6 pb-16 pt-6 md:px-10">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/clinician"
            className="inline-flex items-center gap-1.5 text-[13px] text-ink-soft hover:text-navy"
          >
            <Icon.ChevronLeft size={15} />
            <span className="hidden sm:inline">Patient roster</span>
            <span className="sm:hidden">Roster</span>
          </Link>
          <div className="flex gap-2">
            {isSuspicious && (
              <Link
                href={`/clinician/patients/${patient.id}/dermoscopy` as const}
                className="btn btn-clay !px-3 sm:!px-4"
              >
                <Icon.ZoomIn size={15} />
                <span className="hidden sm:inline">Open dermoscopy triage</span>
                <span className="sm:hidden">Triage</span>
              </Link>
            )}
          </div>
        </div>

        {/* Slim patient header — always at top, even on mobile */}
        <div className="mt-4 flex items-center gap-3 rounded-[15px] border border-line bg-card p-3 sm:p-4">
          <span
            className="grid size-12 flex-shrink-0 place-items-center rounded-full text-[15px] font-semibold"
            style={{
              background:
                patient.urgency !== "routine"
                  ? "var(--color-clay-tint)"
                  : "var(--color-paper)",
              color:
                patient.urgency !== "routine" ? "#9a4a26" : "var(--color-ink-soft)",
              border:
                patient.urgency !== "routine"
                  ? "1px solid var(--color-clay)"
                  : "1px solid var(--color-line)",
            }}
          >
            {patient.code}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-[20px] leading-tight text-navy-deep sm:text-[22px]">
              {patient.name}
            </p>
            <p className="truncate text-[12px] text-ink-faint">
              {patient.age} · {patient.sex} · {patient.folderNumber}
              {patient.consentOnFile && " · consent ✓"}
            </p>
          </div>
          {patient.urgency === "urgent" && (
            <span className="badge-rev flex-shrink-0">URGENT</span>
          )}
          {patient.urgency === "review" && (
            <span className="badge-rev !bg-navy-tint !text-navy-deep !border-[#c8d4e3] flex-shrink-0">
              Review
            </span>
          )}
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)_320px]">
          {/* ====== LEFT: Patient summary ====== */}
          <aside className="order-3 space-y-4 lg:order-1">
            <div className="card">
              <div className="flex items-start gap-3">
                <span
                  className="grid size-12 flex-shrink-0 place-items-center rounded-full text-[15px] font-semibold"
                  style={{
                    background:
                      patient.urgency !== "routine"
                        ? "var(--color-clay-tint)"
                        : "var(--color-paper)",
                    color:
                      patient.urgency !== "routine" ? "#9a4a26" : "var(--color-ink-soft)",
                    border:
                      patient.urgency !== "routine"
                        ? "1px solid var(--color-clay)"
                        : "1px solid var(--color-line)",
                  }}
                >
                  {patient.code}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-[20px] leading-tight text-navy-deep">
                    {patient.name}
                  </p>
                  <p className="text-[12px] text-ink-faint">
                    {patient.age} · {patient.sex} · {patient.folderNumber}
                  </p>
                  {patient.consentOnFile && (
                    <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-sage-deep">
                      <Icon.Check size={11} strokeWidth={2.6} />
                      Consent on file
                    </p>
                  )}
                </div>
              </div>
              <dl className="mt-4 space-y-1.5 border-t border-line pt-3 text-[12.5px]">
                <Row label="Mobile" v={patient.mobile} />
                <Row label="Last visit" v={patient.lastVisit} />
                {patient.nextAppt && <Row label="Next appt" v={patient.nextAppt} />}
              </dl>
            </div>

            <div className="card">
              <h3 className="font-serif text-[16px]">Pre-consult intake</h3>
              <p className="mt-0.5 text-[11px] text-ink-faint">{patient.intake.completed}</p>
              <dl className="mt-3 space-y-2 text-[12.5px]">
                <RowMulti label="Presenting" v={patient.intake.presenting} />
                <RowMulti label="Areas" v={patient.intake.areas} />
                <RowMulti label="Allergies" v={patient.intake.allergies} />
                <RowMulti label="Medications" v={patient.intake.meds} />
                <RowMulti label="History" v={patient.intake.history} />
                <RowMulti label="Photos" v={patient.intake.photos} />
              </dl>
            </div>
          </aside>

          {/* ====== CENTRE: Body + lesion + severity + dx ====== */}
          <section className="order-1 min-w-0 space-y-5 lg:order-2">
            {patient.needsReviewReason && (
              <div className={`flex items-start gap-3 rounded-[15px] border p-4 ${
                patient.urgency === "urgent"
                  ? "border-clay/70 bg-clay-tint/40"
                  : "border-line bg-card"
              }`}>
                <span
                  className={`grid size-9 flex-shrink-0 place-items-center rounded-full ${
                    patient.urgency === "urgent" ? "bg-clay text-white" : "bg-navy text-white"
                  }`}
                >
                  <Icon.Alert size={16} />
                </span>
                <div className="flex-1">
                  <p className="text-[13.5px] font-semibold">
                    {patient.urgency === "urgent" ? "Urgent review" : "Needs your review"}
                  </p>
                  <p className="text-[13px] text-ink-soft">{patient.needsReviewReason}</p>
                </div>
              </div>
            )}

            {/* Body map + lesion list */}
            <div className="card">
              <div className="mb-2 flex items-baseline justify-between">
                <h2 className="font-serif text-[20px] text-navy-deep">Body map</h2>
                <span className="text-[12px] text-ink-faint">
                  {patient.lesions.length} tracked
                </span>
              </div>
              <div className="grid gap-6 md:grid-cols-[auto_1fr]">
                <BodyMap
                  lesions={patient.lesions}
                  scale={1.3}
                  highlightLesionId={selLesion?.id}
                  onLesionClick={(l) => {
                    setSelLesionId(l.id);
                    setSelPhotoIdx(Math.max(0, l.timeline.length - 1));
                  }}
                  onRegionClick={(region) => toast(`Region: ${region}`)}
                />
                <div className="flex flex-col gap-2">
                  <p className="eyebrow">Tracked lesions</p>
                  {patient.lesions.length === 0 && (
                    <p className="text-[12.5px] italic text-ink-faint">
                      No lesions tracked yet.
                    </p>
                  )}
                  {patient.lesions.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        setSelLesionId(l.id);
                        setSelPhotoIdx(Math.max(0, l.timeline.length - 1));
                      }}
                      className={`flex items-center gap-3 rounded-[10px] border p-2.5 text-left transition ${
                        l.id === selLesion?.id
                          ? "border-navy bg-navy-tint/40"
                          : "border-line bg-card hover:bg-paper"
                      }`}
                    >
                      <span className={`lnum ${
                        l.status === "active" || l.status === "suspicious"
                          ? "active"
                          : l.status === "resolved"
                            ? "resolved"
                            : ""
                      }`}>L{l.num}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-semibold">{l.region}</p>
                        <p className="truncate text-[11.5px] text-ink-faint">{l.type}</p>
                      </div>
                      {l.status === "suspicious" && (
                        <span className="badge-rev">!</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected lesion — then vs now + timeline */}
            {selLesion && selPhoto && (
              <div className="card">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`lnum big ${
                        selLesion.status === "active" || selLesion.status === "suspicious"
                          ? "active"
                          : selLesion.status === "resolved"
                            ? "resolved"
                            : ""
                      }`}
                    >
                      L{selLesion.num}
                    </span>
                    <div>
                      <p className="eyebrow">{selLesion.region}</p>
                      <h2 className="font-serif text-[22px] text-navy-deep">{selLesion.type}</h2>
                    </div>
                  </div>
                  <p className="text-[12px] text-ink-faint">
                    {selLesion.timeline.length} timepoint
                    {selLesion.timeline.length === 1 ? "" : "s"} · {selPhoto.date}
                  </p>
                </div>

                {/* Comparison view — slider OR side-by-side */}
                {baselinePhoto && (
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="eyebrow">Compare · baseline vs {selPhoto.label.toLowerCase()}</p>
                      <div
                        className="flex gap-1 rounded-[10px] border border-line bg-paper p-1"
                        role="tablist"
                        aria-label="Comparison view"
                      >
                        <button
                          type="button"
                          onClick={() => setCmpMode("slider")}
                          className={`rounded-[7px] px-3 py-1 text-[11.5px] font-semibold transition ${
                            cmpMode === "slider"
                              ? "bg-card text-navy shadow-card"
                              : "text-ink-faint"
                          }`}
                        >
                          Slider
                        </button>
                        <button
                          type="button"
                          onClick={() => setCmpMode("side")}
                          className={`rounded-[7px] px-3 py-1 text-[11.5px] font-semibold transition ${
                            cmpMode === "side"
                              ? "bg-card text-navy shadow-card"
                              : "text-ink-faint"
                          }`}
                        >
                          Side by side
                        </button>
                      </div>
                    </div>
                    {cmpMode === "slider" ? (
                      <ComparisonSlider
                        before={baselinePhoto}
                        after={selPhoto}
                        beforeLabel="Baseline"
                        afterLabel={selPhoto.label}
                      />
                    ) : (
                      <div className="grid gap-3 md:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setLightboxIdx(0)}
                          className="text-left"
                        >
                          <PhotoFrame
                            photo={baselinePhoto}
                            caption={`Baseline · ${baselinePhoto.date}`}
                            tone="muted"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => setLightboxIdx(selPhotoIdx)}
                          className="text-left"
                        >
                          <PhotoFrame
                            photo={selPhoto}
                            caption={`${selPhoto.label} · ${selPhoto.date}`}
                            tone="primary"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Timepoint strip — click to zoom into lightbox */}
                {selLesion.timeline.length > 2 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-ink-faint">Timeline:</span>
                    <div className="flex flex-1 gap-3 overflow-x-auto pb-2">
                      {selLesion.timeline.map((p, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => {
                            setSelPhotoIdx(i);
                            setLightboxIdx(i);
                          }}
                          className={`flex-shrink-0 ${
                            i === selPhotoIdx ? "outline-2 outline-navy" : ""
                          }`}
                          style={{ width: 82 }}
                          aria-label={`Open ${p.label}`}
                        >
                          <SkinPhoto spec={p.spec} size="square" rounded="md" />
                          <p className="mt-1 text-center text-[10.5px] text-ink-faint">{p.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selLesion.clinicianNote && (
                  <div className="mt-4 rounded-[15px] border border-[#c8d4e3] bg-navy-tint p-4">
                    <div className="flex items-center gap-2 text-[12px] font-semibold text-navy-deep">
                      <Icon.Eye size={13} />
                      {selLesion.clinicianNoteAuthor} · {selLesion.clinicianNoteWhen}
                    </div>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#2a3850]">
                      {selLesion.clinicianNote}
                    </p>
                  </div>
                )}

                {selLesion.description && (
                  <p className="mt-3 text-[13px] text-ink-soft">
                    {selLesion.description}
                  </p>
                )}
              </div>
            )}

            {/* Severity chart */}
            {patient.severityTrend.length > 0 && (
              <div className="card">
                <SeverityChart points={patient.severityTrend} />
              </div>
            )}

            {/* Diagnoses */}
            <div className="card">
              <div className="space-y-4">
                <DxBlock
                  title="Differential diagnoses"
                  list={diffDx}
                  variant="differential"
                  onAdd={() => setShowIcd("differential")}
                />
                <DxBlock
                  title="Confirmed diagnoses"
                  list={confDx}
                  variant="confirmed"
                  onAdd={() => setShowIcd("confirmed")}
                />
              </div>
            </div>
          </section>

          {/* ====== RIGHT: Quick actions / Plan / Rx / Audit ====== */}
          <aside className="order-2 space-y-4 lg:order-3">
            <div className="card">
              <h3 className="font-serif text-[18px]">Actions</h3>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowRx(true)}
                >
                  <Icon.Pill size={15} />
                  Prescribe
                </button>
                <button
                  type="button"
                  className="btn btn-sage"
                  onClick={() => toast("Marked reviewed · patient notified")}
                >
                  <Icon.Check size={15} />
                  Mark reviewed
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowIcd("confirmed")}
                >
                  <Icon.Code size={14} />
                  Add code
                </button>
                {isSuspicious ? (
                  <button
                    type="button"
                    className="btn btn-clay"
                    onClick={() => router.push(`/clinician/patients/${patient.id}/dermoscopy` as const)}
                  >
                    <Icon.ZoomIn size={14} />
                    Dermoscopy
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => toast("New lesion — pick a body region")}
                  >
                    <Icon.Add size={14} />
                    Add lesion
                  </button>
                )}
              </div>
            </div>

            {patient.protocols.map((proto) => (
              <div key={proto.id} className="card">
                <p className="eyebrow">Treatment protocol</p>
                <h3 className="mt-1 font-serif text-[17px] text-navy-deep">{proto.name}</h3>
                <p className="mt-1 text-[12.5px] text-ink-soft">{proto.summary}</p>
                <p className="mt-2 text-[11px] text-ink-faint">
                  Assigned {proto.assignedDate} · {proto.assignedBy}
                </p>
                <div className="mt-3 space-y-1.5">
                  {proto.steps.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 grid size-4 flex-shrink-0 place-items-center rounded-[5px] ${
                          s.done ? "bg-sage-deep" : "border border-line"
                        }`}
                      >
                        {s.done && (
                          <svg viewBox="0 0 24 24" width="9" fill="none" stroke="#fff" strokeWidth="3">
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                        )}
                      </span>
                      <span className={`flex-1 text-[12px] leading-tight ${
                        s.done ? "text-ink-faint line-through" : "text-ink"
                      }`}>
                        {s.text}
                        <span className={`ml-2 text-[10.5px] font-semibold ${
                          s.due.toLowerCase().includes("this week") || s.due.toLowerCase().includes("due")
                            ? "text-[#9a4a26]"
                            : "text-ink-faint"
                        }`}>
                          {s.due}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
                {proto.surveillanceNote && (
                  <p className="mt-3 rounded-[10px] border border-[#e6c3b0] bg-clay-tint/60 px-3 py-2 text-[11.5px] leading-snug text-[#8a5238]">
                    <strong className="font-semibold">Surveillance.</strong>{" "}
                    {proto.surveillanceNote}
                  </p>
                )}
              </div>
            ))}

            {patient.prescriptions.length > 0 && (
              <div className="card">
                <h3 className="font-serif text-[17px] text-navy-deep">Active scripts</h3>
                <ul className="mt-2 space-y-2.5">
                  {patient.prescriptions.map((rx) => (
                    <li key={rx.id} className="flex items-start gap-2.5 border-t border-line pt-2.5 first:border-0 first:pt-0">
                      <span className="grid size-8 flex-shrink-0 place-items-center rounded-md bg-navy-tint text-navy">
                        <Icon.Pill size={14} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold">{rx.drug}</p>
                        <p className="line-clamp-2 text-[11.5px] text-ink-faint">{rx.signa}</p>
                        {rx.schedule && (
                          <p className="mt-0.5 text-[10.5px] font-semibold text-navy">
                            {rx.schedule} · {rx.date}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {patient.audit.length > 0 && (
              <div className="card">
                <h3 className="font-serif text-[17px] text-navy-deep">Audit</h3>
                <ul className="mt-2 space-y-2">
                  {patient.audit.slice(0, 5).map((a, i) => (
                    <li key={i} className="text-[12px]">
                      <p className="leading-snug">
                        <span className="font-semibold">{a.action}</span> · {a.what}
                      </p>
                      <p className="text-[10.5px] text-ink-faint">
                        {a.when} · {a.who}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>

      {showRx && (
        <PrescribeSheet
          patient={patient}
          onClose={() => setShowRx(false)}
          onSent={() => {
            setShowRx(false);
            toast("Script sent to pharmacy");
          }}
        />
      )}
      {showIcd && (
        <IcdSheet
          bucket={showIcd}
          onClose={() => setShowIcd(null)}
          onPick={(c) => {
            addDx(showIcd, c.code, c.name);
            setShowIcd(null);
          }}
        />
      )}
      {lightboxIdx != null && selLesion && (
        <PhotoLightbox
          photos={selLesion.timeline}
          startIndex={lightboxIdx}
          title={`L${selLesion.num} · ${selLesion.region}`}
          subtitle={selLesion.type}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </div>
  );
}

function Row({ label, v }: { label: string; v: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-[70px] flex-shrink-0 text-ink-faint">{label}</dt>
      <dd className="flex-1 text-ink">{v}</dd>
    </div>
  );
}

function RowMulti({ label, v }: { label: string; v: string }) {
  return (
    <div>
      <dt className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-faint">
        {label}
      </dt>
      <dd className="mt-0.5 text-[12.5px] leading-snug text-ink-soft">{v}</dd>
    </div>
  );
}

function PhotoFrame({
  photo,
  caption,
  tone,
}: {
  photo: LesionPhoto;
  caption: string;
  tone: "primary" | "muted";
}) {
  return (
    <div className="relative">
      <SkinPhoto spec={photo.spec} size="hero" rounded="md" />
      <span
        className={`absolute bottom-2.5 left-2.5 rounded-md px-2.5 py-1 text-[11px] font-medium ${
          tone === "primary" ? "bg-[rgba(17,22,29,0.82)] text-white" : "bg-[rgba(241,240,236,0.92)] text-ink"
        }`}
      >
        {caption}
      </span>
      {photo.severity != null && (
        <span className="absolute right-2.5 top-2.5 rounded-md bg-[rgba(17,22,29,0.72)] px-2 py-1 text-[10.5px] font-semibold text-white">
          local · {photo.severity}
        </span>
      )}
    </div>
  );
}

function DxBlock({
  title,
  list,
  variant,
  onAdd,
}: {
  title: string;
  list: Patient["confirmed"];
  variant: "differential" | "confirmed";
  onAdd: () => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="eyebrow">{title}</p>
        <button
          type="button"
          onClick={onAdd}
          className="text-[11.5px] font-semibold text-sage-deep hover:underline"
        >
          + Add code
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {list.length === 0 ? (
          <span className="text-[12px] italic text-ink-faint">None recorded yet</span>
        ) : (
          list.map((d) => (
            <span key={d.code} className={`dx-chip ${variant}`}>
              <span className="dx-code">{d.code}</span>
              <span>{d.name}</span>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
