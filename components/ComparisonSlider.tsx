"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SkinPhoto } from "./SkinPhoto";
import type { LesionPhoto } from "@/lib/mock/types";

/**
 * Before / after wipe slider. The classic dermatology comparison: drag
 * the divider to reveal the right (today) photo over the left (baseline)
 * photo. Touch- and mouse-aware; keyboard accessible via the handle's
 * arrow keys.
 */

type Props = {
  before: LesionPhoto;
  after: LesionPhoto;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
};

export function ComparisonSlider({
  before,
  after,
  beforeLabel = "Baseline",
  afterLabel = "Today",
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [pct, setPct] = useState(50);
  const draggingRef = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const x = clientX - rect.left;
    const p = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPct(p);
  }, []);

  useEffect(() => {
    function move(e: MouseEvent | TouchEvent) {
      if (!draggingRef.current) return;
      const clientX =
        "touches" in e ? e.touches[0]?.clientX ?? 0 : (e as MouseEvent).clientX;
      setFromClientX(clientX);
    }
    function up() {
      draggingRef.current = false;
    }
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, [setFromClientX]);

  return (
    <div
      ref={wrapRef}
      className={`relative select-none overflow-hidden rounded-[15px] border border-line ${className}`}
      onMouseDown={(e) => {
        draggingRef.current = true;
        setFromClientX(e.clientX);
      }}
      onTouchStart={(e) => {
        draggingRef.current = true;
        const t = e.touches[0];
        if (t) setFromClientX(t.clientX);
      }}
      style={{ aspectRatio: "16/11", cursor: "ew-resize" }}
    >
      {/* Before (full-width) */}
      <div className="absolute inset-0">
        <SkinPhoto spec={before.spec} size="hero" rounded="none" />
        <span className="pointer-events-none absolute bottom-2.5 left-2.5 rounded-md bg-[rgba(241,240,236,0.94)] px-2 py-1 text-[11px] font-semibold text-ink">
          {beforeLabel} · {before.date}
        </span>
      </div>
      {/* After (clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${pct}%)` }}
      >
        <SkinPhoto spec={after.spec} size="hero" rounded="none" />
        <span className="pointer-events-none absolute bottom-2.5 right-2.5 rounded-md bg-[rgba(17,22,29,0.82)] px-2 py-1 text-[11px] font-semibold text-white">
          {afterLabel} · {after.date}
        </span>
      </div>
      {/* Divider */}
      <div
        className="pointer-events-none absolute top-0 bottom-0"
        style={{ left: `${pct}%`, transform: "translateX(-1px)" }}
      >
        <div className="h-full w-[2px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.18)]" />
        <button
          type="button"
          aria-label="Drag to compare"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPct((p) => Math.max(0, p - 4));
            else if (e.key === "ArrowRight") setPct((p) => Math.min(100, p + 4));
          }}
          className="pointer-events-auto absolute left-1/2 top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-navy shadow-[var(--shadow-lg)]"
          style={{ cursor: "ew-resize" }}
        >
          <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 6-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
