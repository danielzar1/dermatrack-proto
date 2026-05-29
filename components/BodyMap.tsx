"use client";

import { useState } from "react";
import type { Lesion, BodyView } from "@/lib/mock/types";

/**
 * Body map — front/back SVG anatomical regions with numbered lesion
 * badges. Click a region for the toast/info; click a badge to open that
 * lesion's timeline.
 */

type Props = {
  lesions: Lesion[];
  initialView?: BodyView;
  scale?: number; // multiplier on the 200×360 base
  onLesionClick?: (lesion: Lesion) => void;
  onRegionClick?: (region: string, view: BodyView) => void;
  highlightLesionId?: string;
  className?: string;
};

type RegionDef = {
  label: string;
  // SVG element: ellipse | rect | path
  el: "ellipse" | "rect" | "path";
  attrs: Record<string, string | number>;
};

const FRONT: RegionDef[] = [
  { label: "Head & face", el: "ellipse", attrs: { cx: 100, cy: 34, rx: 22, ry: 26 } },
  { label: "Neck (front)", el: "rect", attrs: { x: 90, y: 58, width: 20, height: 16, rx: 6 } },
  {
    label: "Chest & abdomen",
    el: "path",
    attrs: { d: "M64 76 h72 q10 0 10 12 v74 q0 12 -12 12 h-68 q-12 0 -12 -12 v-74 q0 -12 10 -12 z" },
  },
  { label: "Left upper arm (front)", el: "rect", attrs: { x: 30, y: 82, width: 26, height: 56, rx: 13 } },
  { label: "Left forearm (front)", el: "rect", attrs: { x: 28, y: 140, width: 24, height: 54, rx: 12 } },
  { label: "Right upper arm (front)", el: "rect", attrs: { x: 144, y: 82, width: 26, height: 56, rx: 13 } },
  { label: "Right forearm (front)", el: "rect", attrs: { x: 148, y: 140, width: 24, height: 54, rx: 12 } },
  { label: "Left thigh (front)", el: "rect", attrs: { x: 68, y: 178, width: 30, height: 74, rx: 15 } },
  { label: "Left shin", el: "rect", attrs: { x: 70, y: 256, width: 26, height: 78, rx: 13 } },
  { label: "Right thigh (front)", el: "rect", attrs: { x: 102, y: 178, width: 30, height: 74, rx: 15 } },
  { label: "Right shin", el: "rect", attrs: { x: 104, y: 256, width: 26, height: 78, rx: 13 } },
];

const BACK: RegionDef[] = [
  { label: "Scalp / back of head", el: "ellipse", attrs: { cx: 100, cy: 34, rx: 22, ry: 26 } },
  { label: "Nape of neck", el: "rect", attrs: { x: 90, y: 58, width: 20, height: 16, rx: 6 } },
  {
    label: "Upper & lower back",
    el: "path",
    attrs: { d: "M64 76 h72 q10 0 10 12 v74 q0 12 -12 12 h-68 q-12 0 -12 -12 v-74 q0 -12 10 -12 z" },
  },
  { label: "Right upper arm (back)", el: "rect", attrs: { x: 30, y: 82, width: 26, height: 56, rx: 13 } },
  { label: "Right forearm (back)", el: "rect", attrs: { x: 28, y: 140, width: 24, height: 54, rx: 12 } },
  { label: "Left upper arm (back)", el: "rect", attrs: { x: 144, y: 82, width: 26, height: 56, rx: 13 } },
  { label: "Left forearm (back)", el: "rect", attrs: { x: 148, y: 140, width: 24, height: 54, rx: 12 } },
  { label: "Right thigh (back)", el: "rect", attrs: { x: 68, y: 178, width: 30, height: 74, rx: 15 } },
  { label: "Right calf", el: "rect", attrs: { x: 70, y: 256, width: 26, height: 78, rx: 13 } },
  { label: "Left thigh (back)", el: "rect", attrs: { x: 102, y: 178, width: 30, height: 74, rx: 15 } },
  { label: "Left calf", el: "rect", attrs: { x: 104, y: 256, width: 26, height: 78, rx: 13 } },
];

/**
 * Hit-test whether the lesion's coords sit inside a region's SVG shape.
 * Ellipses and rects are exact; paths fall back to a rough bounding-box
 * test (good enough for the trunk panel, which is the only path we use).
 */
function pointInRegion(x: number, y: number, r: RegionDef): boolean {
  const n = (v: string | number | undefined) => (typeof v === "number" ? v : 0);
  const a = r.attrs;
  if (r.el === "ellipse") {
    const rx = n(a.rx) || 1;
    const ry = n(a.ry) || 1;
    const dx = (x - n(a.cx)) / rx;
    const dy = (y - n(a.cy)) / ry;
    return dx * dx + dy * dy <= 1.05;
  }
  if (r.el === "rect") {
    const rx = n(a.x);
    const ry = n(a.y);
    return x >= rx && x <= rx + n(a.width) && y >= ry && y <= ry + n(a.height);
  }
  // Trunk path "M64 76 h72 q10 0 10 12 v74 q0 12 -12 12 h-68 …" — bbox.
  return x >= 52 && x <= 146 && y >= 76 && y <= 174;
}

export function BodyMap({
  lesions,
  initialView = "front",
  scale = 1.4,
  onLesionClick,
  onRegionClick,
  highlightLesionId,
  className = "",
}: Props) {
  const [view, setView] = useState<BodyView>(initialView);
  const regions = view === "front" ? FRONT : BACK;
  const activeLesions = lesions.filter((l) => l.view === view);

  const lesionsForRegion = (r: RegionDef) =>
    activeLesions.filter((l) => pointInRegion(l.coords.x, l.coords.y, r));
  const isRegionFlagged = (r: RegionDef) =>
    lesionsForRegion(r).some(
      (l) => l.status === "active" || l.status === "suspicious",
    );
  const isRegionTracked = (r: RegionDef) => lesionsForRegion(r).length > 0;

  return (
    <div className={className}>
      <div
        className="mx-auto flex w-fit gap-1 rounded-[10px] border border-line bg-paper p-1"
        role="tablist"
      >
        <button
          type="button"
          className={`rounded-[7px] px-4 py-1.5 text-xs font-semibold transition ${
            view === "front" ? "bg-card text-navy shadow-card" : "text-ink-faint"
          }`}
          onClick={() => setView("front")}
        >
          Front
        </button>
        <button
          type="button"
          className={`rounded-[7px] px-4 py-1.5 text-xs font-semibold transition ${
            view === "back" ? "bg-card text-navy shadow-card" : "text-ink-faint"
          }`}
          onClick={() => setView("back")}
        >
          Back
        </button>
      </div>

      <div className="mt-3 flex justify-center">
        <svg
          viewBox="0 0 200 360"
          width={200 * scale}
          height={360 * scale}
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          {regions.map((r, i) => {
            const flagged = isRegionFlagged(r);
            const tracked = !flagged && isRegionTracked(r);
            const cls = `region ${flagged ? "flagged" : tracked ? "tracked" : ""}`;
            const common = {
              className: cls,
              onClick: () => onRegionClick?.(r.label, view),
            };
            if (r.el === "ellipse") return <ellipse key={i} {...common} {...r.attrs} />;
            if (r.el === "rect") return <rect key={i} {...common} {...r.attrs} />;
            return <path key={i} {...common} {...r.attrs} />;
          })}
          {activeLesions.map((l) => {
            const isHl = l.id === highlightLesionId;
            const statusCls =
              l.status === "active" || l.status === "suspicious"
                ? "active"
                : l.status === "resolved"
                  ? "resolved"
                  : "calm";
            return (
              <g
                key={l.id}
                className={`lesion-badge ${statusCls}`}
                transform={`translate(${l.coords.x},${l.coords.y})`}
                onClick={() => onLesionClick?.(l)}
                style={{ cursor: onLesionClick ? "pointer" : "default" }}
              >
                <circle r={isHl ? 12 : 10} />
                <text>L{l.num}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-3 border-t border-line pt-3 text-[11.5px] text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-full bg-clay" />
          Needs review
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-full bg-sage-deep" />
          Calm / tracked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-full border border-navy bg-navy-tint" />
          Tap to add
        </span>
      </div>
    </div>
  );
}
