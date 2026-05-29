"use client";

import { useCallback, useEffect, useState } from "react";
import { SkinPhoto } from "./SkinPhoto";
import { Icon } from "./Icons";
import type { LesionPhoto } from "@/lib/mock/types";

/**
 * Fullscreen photo viewer for serial dermatology imagery. Click any
 * thumbnail / hero photo to open. Navigate timepoints with arrows or
 * keys; ESC to close.
 */

type Props = {
  photos: LesionPhoto[];
  startIndex?: number;
  title?: string;
  subtitle?: string;
  onClose: () => void;
};

export function PhotoLightbox({
  photos,
  startIndex = 0,
  title,
  subtitle,
  onClose,
}: Props) {
  const [idx, setIdx] = useState(() => Math.max(0, Math.min(startIndex, photos.length - 1)));

  const prev = useCallback(
    () => setIdx((i) => (i > 0 ? i - 1 : photos.length - 1)),
    [photos.length],
  );
  const next = useCallback(
    () => setIdx((i) => (i < photos.length - 1 ? i + 1 : 0)),
    [photos.length],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  const photo = photos[idx];
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/85 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 text-white">
        <div className="min-w-0">
          {title && (
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/60">
              {title}
            </p>
          )}
          <p className="truncate font-serif text-[18px]">{subtitle ?? photo.label}</p>
          <p className="truncate text-[12px] text-white/65">{photo.date}</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close"
          className="grid size-10 place-items-center rounded-full bg-white/12 text-white transition hover:bg-white/20"
        >
          <Icon.X size={18} />
        </button>
      </div>

      {/* Photo */}
      <div
        className="flex flex-1 items-center justify-center px-6 pb-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-[760px]">
          <SkinPhoto spec={photo.spec} size="hero" rounded="lg" />
          {photo.severity != null && (
            <span className="absolute right-3 top-3 rounded-md bg-white/15 px-2.5 py-1 text-[11.5px] font-semibold text-white">
              Local · {photo.severity}
            </span>
          )}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous"
                className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              >
                <Icon.ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next"
                className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              >
                <Icon.ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div
          className="flex justify-center gap-2 px-5 py-4"
          onClick={(e) => e.stopPropagation()}
        >
          {photos.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              className="flex-shrink-0"
              style={{ width: 64 }}
              aria-label={`Open ${p.label}`}
            >
              <div
                className={`relative ${
                  i === idx ? "ring-2 ring-white" : "opacity-70 hover:opacity-100"
                } overflow-hidden rounded-md transition`}
              >
                <SkinPhoto spec={p.spec} size="square" rounded="none" />
              </div>
              <p className="mt-1 text-center text-[10px] text-white/65">{p.label}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
