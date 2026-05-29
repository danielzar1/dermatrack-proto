"use client";

import { useMemo } from "react";
import type { SeverityPoint } from "@/lib/mock/types";

/**
 * Compact SVG severity-trend chart (area + line + dots) for objective
 * dermatology scores (mSWAT, PASI, SCORAD, BSA, ...). Pure SVG, no chart
 * library. Scales to its container; height fixed to keep proportions
 * tight inside cards.
 */

type Props = {
  points: SeverityPoint[];
  unit?: SeverityPoint["unit"]; // overrides inferred unit
  height?: number;
  className?: string;
  /** If true, a downward trend is treated as good (default — severity going down) */
  goodIsDown?: boolean;
};

export function SeverityChart({
  points,
  unit,
  height = 140,
  className = "",
  goodIsDown = true,
}: Props) {
  const W = 600;
  const H = height;
  const padL = 36;
  const padR = 12;
  const padT = 18;
  const padB = 30;

  const shown = points;
  const displayUnit = unit ?? shown[0]?.unit ?? "";

  const { areaPath, linePath, dots, yTicks } = useMemo(() => {
    if (shown.length === 0) {
      return { areaPath: "", linePath: "", dots: [], yTicks: [] as Array<{ y: number; v: number }> };
    }
    const values = shown.map((p) => p.value);
    const vMin = Math.min(...values, 0);
    const vMax = Math.max(...values) * 1.15 || 1;
    const xStep = shown.length > 1 ? (W - padL - padR) / (shown.length - 1) : 0;
    const yFor = (v: number) => H - padB - ((v - vMin) / (vMax - vMin || 1)) * (H - padT - padB);

    const coords = shown.map((p, i) => ({ x: padL + i * xStep, y: yFor(p.value), v: p.value }));

    let l = "";
    coords.forEach((c, i) => {
      if (i === 0) l += `M ${c.x.toFixed(2)} ${c.y.toFixed(2)}`;
      else {
        const prev = coords[i - 1];
        if (!prev) return;
        const mx = (prev.x + c.x) / 2;
        l += ` C ${mx.toFixed(2)} ${prev.y.toFixed(2)}, ${mx.toFixed(2)} ${c.y.toFixed(2)}, ${c.x.toFixed(2)} ${c.y.toFixed(2)}`;
      }
    });
    const a = `${l} L ${(padL + (shown.length - 1) * xStep).toFixed(2)} ${(H - padB).toFixed(2)} L ${padL} ${(H - padB).toFixed(2)} Z`;

    const tickCount = 3;
    const ticks: Array<{ y: number; v: number }> = [];
    for (let i = 0; i <= tickCount; i++) {
      const v = vMin + ((vMax - vMin) * i) / tickCount;
      ticks.push({ y: yFor(v), v });
    }

    return { areaPath: a, linePath: l, dots: coords, yTicks: ticks };
  }, [shown, H, padL, padR, padT, padB, W]);

  const first = shown[0];
  const last = shown[shown.length - 1];
  const delta = first && last ? last.value - first.value : 0;
  const trendGood = goodIsDown ? delta <= 0 : delta >= 0;
  const trendLabel =
    delta === 0
      ? "Stable"
      : delta < 0
        ? `${Math.abs(delta).toFixed(1)} lower`
        : `${delta.toFixed(1)} higher`;

  return (
    <div className={className}>
      <div className="mb-2 flex items-end justify-between">
        <div>
          <p className="eyebrow">Severity · {displayUnit}</p>
          <p className="mt-0.5 text-[13px] text-ink-soft">
            {shown.length} timepoint{shown.length === 1 ? "" : "s"} ·{" "}
            <span className={trendGood ? "text-sage-deep font-semibold" : "text-clay font-semibold"}>
              {trendLabel}
            </span>
          </p>
        </div>
        {last && (
          <div className="text-right">
            <p className="font-serif text-2xl text-navy">{last.value}</p>
            <p className="text-[11px] text-ink-faint">{last.date}</p>
          </div>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={padL} y1={t.y} x2={W - padR} y2={t.y} className="chart-grid" />
            <text x={padL - 6} y={t.y + 3} textAnchor="end" fontSize="9" fill="var(--color-ink-faint)">
              {t.v.toFixed(t.v < 10 ? 1 : 0)}
            </text>
          </g>
        ))}
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} className="chart-axis" />
        {areaPath && <path d={areaPath} className="chart-area" />}
        {linePath && <path d={linePath} className="chart-line" />}
        {dots.map((c, i) => (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r="3.5" className="chart-dot" />
            {shown[i] && (
              <text
                x={c.x}
                y={H - padB + 16}
                textAnchor="middle"
                fontSize="9"
                fill="var(--color-ink-faint)"
              >
                {shown[i].date.split(" ").slice(0, 2).join(" ")}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
