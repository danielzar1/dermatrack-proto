"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";
import { patients } from "@/lib/mock/patients";
import { SkinPhoto } from "@/components/SkinPhoto";
import { SeverityChart } from "@/components/SeverityChart";
import { Icon } from "@/components/Icons";
import { useToast } from "@/components/Toaster";
import { PhotoLightbox } from "@/components/PhotoLightbox";

/**
 * Patient lesion timeline. Photo hero + compare strip + clinician note +
 * inline severity trend.
 */
export function PatientLesionClient({ lno }: { lno: string }) {
  const num = parseInt(lno, 10);
  const patient = patients[0]!;
  const lesion = patient.lesions.find((l) => l.num === num);
  if (!lesion) notFound();

  const [idx, setIdx] = useState(lesion.timeline.length - 1);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const photo = lesion.timeline[idx]!;
  const { toast } = useToast();

  // Per-lesion severity points (synthetic — built from timeline)
  const localTrend = lesion.timeline
    .filter((p) => p.severity != null)
    .map((p) => ({ date: p.date, value: p.severity!, unit: "BSA" as const }));

  return (
    <div>
      <Link
        href="/patient/body"
        className="inline-flex items-center gap-1.5 pt-2 text-[13px] text-ink-soft"
      >
        <Icon.ChevronLeft size={15} />
        Body map
      </Link>

      <div className="mt-2 flex items-center gap-3">
        <span
          className={`lnum big ${
            lesion.status === "active" ? "active" : lesion.status === "resolved" ? "resolved" : ""
          }`}
        >
          L{lesion.num}
        </span>
        <div>
          <p className="eyebrow">{lesion.region}</p>
          <h1 className="mt-0.5 font-serif text-[22px]">{lesion.type}</h1>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setLightboxIdx(idx)}
        className="relative mt-3 block w-full text-left"
        aria-label="Zoom photo"
      >
        <SkinPhoto spec={photo.spec} size="hero" rounded="md" />
        <span className="absolute bottom-2.5 left-2.5 rounded-md bg-[rgba(17,22,29,0.78)] px-2.5 py-1 text-[11px] font-medium text-white">
          {photo.label} · {photo.date}
        </span>
        <span className="absolute right-2.5 top-2.5 grid size-7 place-items-center rounded-md bg-[rgba(17,22,29,0.5)] text-white">
          <Icon.ZoomIn size={13} />
        </span>
      </button>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {lesion.timeline.map((p, i) => (
          <button
            type="button"
            key={i}
            onClick={() => {
              setIdx(i);
              setLightboxIdx(i);
            }}
            className={`flex-shrink-0 ${i === idx ? "outline-2 outline-navy" : ""}`}
            style={{ width: 70 }}
          >
            <SkinPhoto spec={p.spec} size="square" rounded="md" />
            <p className="mt-1 text-center text-[10px] text-ink-faint">{p.label}</p>
          </button>
        ))}
      </div>

      {lesion.clinicianNote && (
        <div className="mt-3 rounded-[15px] border border-[#c8d4e3] bg-navy-tint p-3">
          <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-navy-deep">
            <Icon.Eye size={12} />
            {lesion.clinicianNoteAuthor} · {lesion.clinicianNoteWhen}
          </div>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#2a3850]">
            {lesion.clinicianNote}
          </p>
        </div>
      )}

      {localTrend.length > 1 && (
        <div className="card mt-3">
          <SeverityChart points={localTrend} unit="BSA" height={120} />
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => toast("Camera — open in a real device")}
          className="btn flex-1"
        >
          <Icon.Camera size={15} />
          New photo
        </button>
        <button
          type="button"
          onClick={() => toast("Logged")}
          className="btn btn-outline flex-1"
        >
          Log details
        </button>
      </div>
      {lightboxIdx != null && (
        <PhotoLightbox
          photos={lesion.timeline}
          startIndex={lightboxIdx}
          title={`L${lesion.num} · ${lesion.region}`}
          subtitle={lesion.type}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </div>
  );
}
