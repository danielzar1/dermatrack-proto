"use client";

import { useId, useMemo } from "react";
import type { PhotoSpec, SkinTone } from "@/lib/mock/types";

/**
 * Synthetic dermatology imagery — fully procedural SVG. No real patient
 * photos involved. The visual rig: skin-tone base with fractal-noise
 * texture, irregular blob lesion(s) with soft edges, layered colour
 * (erythema, pigment, scale, depigmentation) per variant. Outputs look
 * far more convincing than flat gradients at thumb / hero sizes while
 * remaining unambiguously stylised at very large zoom.
 *
 * Each render gets unique filter IDs so multiple instances don't collide.
 */

type Props = {
  spec: PhotoSpec;
  rounded?: "sm" | "md" | "lg" | "none";
  /** "thumb" | "card" | "hero" — controls the SVG aspect / framing */
  size?: "thumb" | "card" | "hero" | "square";
  className?: string;
  /** Optional overlay markers (e.g. ABCDE annotations) */
  children?: React.ReactNode;
};

const SKIN_BASE: Record<SkinTone, [string, string]> = {
  fair: ["#f1d3bf", "#e3b89e"],
  med: ["#d9a986", "#c08967"],
  olive: ["#c6916b", "#a9744d"],
  dark: ["#7d4f33", "#5b3a25"],
};

// Small deterministic PRNG so a seed → stable shape.
function prng(seed: number) {
  let s = seed | 0 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s & 0x7fffffff) / 0x7fffffff;
  };
}

/** Generate a closed blob path on a circle of radius r centred at (cx,cy). */
function blobPath(seed: number, cx: number, cy: number, r: number, jitter = 0.18): string {
  const rand = prng(seed);
  const n = 10;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2;
    const rr = r * (1 + (rand() - 0.5) * 2 * jitter);
    pts.push([cx + Math.cos(angle) * rr, cy + Math.sin(angle) * rr]);
  }
  // smooth catmull-rom-ish through points (closed)
  const get = (i: number): [number, number] => {
    const p = pts[((i % n) + n) % n];
    return p ?? [cx, cy];
  };
  let d = "";
  for (let i = 0; i < n; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    if (i === 0) d += `M ${p1[0].toFixed(2)} ${p1[1].toFixed(2)} `;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} `;
  }
  return d + "Z";
}

function withAlpha(hex: string, alpha: number): string {
  // hex like #rrggbb → rgba()
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function SkinPhoto({
  spec,
  rounded = "md",
  size = "card",
  className = "",
  children,
}: Props) {
  const uid = useId().replace(/:/g, "_");
  const noiseId = `n_${uid}`;
  const blurId = `b_${uid}`;
  const networkId = `net_${uid}`;
  const erythId = `er_${uid}`;
  const radial = `rad_${uid}`;

  const [skinA, skinB] = SKIN_BASE[spec.skinTone];

  // Frame: 200×200 viewBox, but rectangular aspect at hero/card.
  const VB = 200;
  const aspect =
    size === "hero"
      ? "16/11"
      : size === "thumb"
        ? "1/1"
        : size === "square"
          ? "1/1"
          : "4/3";

  const radius = rounded === "none" ? 0 : rounded === "sm" ? 10 : rounded === "lg" ? 22 : 15;

  // Build the lesion shape(s) up front so we can compose visual layers.
  const composition = useMemo(() => {
    const r = 30 + spec.size * 55; // base lesion radius in vb units
    const cx = VB / 2 + ((prng(spec.seed)() - 0.5) * 18);
    const cy = VB / 2 + ((prng(spec.seed + 1)() - 0.5) * 16);

    const jitter = 0.12 + (spec.borderIrregularity ?? 0.15) * 0.45;
    const mainPath = blobPath(spec.seed, cx, cy, r, jitter);

    // Inner darker zone for pigmented or active plaques
    const innerPath = blobPath(spec.seed + 7, cx + 3, cy - 4, r * 0.55, jitter * 1.1);

    // For inflammatory / acne — many small papules scattered
    const papules: Array<{ x: number; y: number; rr: number }> = [];
    if (spec.variant === "inflammatory" || spec.variant === "acne") {
      const rand = prng(spec.seed + 99);
      const count = spec.variant === "acne" ? 14 : 24;
      for (let i = 0; i < count; i++) {
        const a = rand() * Math.PI * 2;
        const dist = rand() * r * 0.92;
        papules.push({
          x: cx + Math.cos(a) * dist,
          y: cy + Math.sin(a) * dist,
          rr: 1.8 + rand() * 3.5,
        });
      }
    }

    return { cx, cy, r, mainPath, innerPath, papules };
  }, [spec]);

  // Per-variant overlays.
  const renderLesion = () => {
    const { cx, cy, r, mainPath, innerPath, papules } = composition;
    const erythCol = spec.skinTone === "dark" ? "#a55747" : "#c25a48";
    const scaleCol = "#f0e7d8";

    switch (spec.variant) {
      case "plaque":
        return (
          <>
            <path
              d={mainPath}
              fill={withAlpha(erythCol, 0.55 + spec.erythema * 0.4)}
              filter={`url(#${blurId})`}
            />
            <path d={innerPath} fill={withAlpha(erythCol, 0.35)} filter={`url(#${blurId})`} />
            {spec.scale > 0.1 && (
              <path
                d={innerPath}
                fill={withAlpha(scaleCol, spec.scale * 0.55)}
                opacity={0.85}
              />
            )}
          </>
        );

      case "patch":
        return (
          <>
            <path
              d={mainPath}
              fill={withAlpha(
                spec.skinTone === "dark" ? "#3d2515" : "#a87358",
                0.35 + spec.erythema * 0.25,
              )}
              filter={`url(#${blurId})`}
            />
          </>
        );

      case "pigmented":
        return (
          <>
            <path d={mainPath} fill="#5a3d20" opacity={0.78} filter={`url(#${blurId})`} />
            <path
              d={innerPath}
              fill="#2d1b0a"
              opacity={0.7 + (spec.pigmentVariance ?? 0) * 0.25}
              filter={`url(#${blurId})`}
            />
            {(spec.pigmentVariance ?? 0) > 0.4 && (
              <>
                <circle
                  cx={cx - r * 0.25}
                  cy={cy + r * 0.05}
                  r={r * 0.18}
                  fill="#1a0f06"
                  opacity={0.6}
                  filter={`url(#${blurId})`}
                />
                <circle
                  cx={cx + r * 0.15}
                  cy={cy - r * 0.2}
                  r={r * 0.12}
                  fill="#7a4a26"
                  opacity={0.55}
                  filter={`url(#${blurId})`}
                />
              </>
            )}
            {(spec.pigmentVariance ?? 0) > 0.7 && (
              <circle
                cx={cx + r * 0.3}
                cy={cy + r * 0.18}
                r={r * 0.16}
                fill="#3a4960"
                opacity={0.42}
                filter={`url(#${blurId})`}
              />
            )}
          </>
        );

      case "inflammatory":
        return (
          <>
            <path
              d={mainPath}
              fill={withAlpha(erythCol, 0.32 + spec.erythema * 0.25)}
              filter={`url(#${blurId})`}
            />
            {papules.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={p.rr}
                fill={withAlpha(erythCol, 0.7)}
              />
            ))}
          </>
        );

      case "scaly":
        return (
          <>
            <path
              d={mainPath}
              fill={withAlpha(erythCol, 0.65)}
              stroke="#6b2e1d"
              strokeWidth={0.6}
              strokeOpacity={0.4}
            />
            <path
              d={innerPath}
              fill="#efe6d4"
              opacity={0.55 + spec.scale * 0.4}
            />
            <path
              d={blobPath(spec.seed + 13, cx, cy, r * 0.32, 0.3)}
              fill="#fbf6ea"
              opacity={0.6}
            />
          </>
        );

      case "vitiligo":
        return (
          <path
            d={mainPath}
            fill="#f4ddc5"
            opacity={0.78}
            filter={`url(#${blurId})`}
          />
        );

      case "acne":
        return (
          <>
            {papules.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={p.rr * 1.5}
                  fill={withAlpha(erythCol, 0.35)}
                  filter={`url(#${blurId})`}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={p.rr * 0.6}
                  fill={i % 4 === 0 ? "#fef4e7" : "#7a3023"}
                  opacity={0.85}
                />
              </g>
            ))}
          </>
        );

      case "dermoscopy":
        return (
          <>
            {/* Dark pigmented field */}
            <rect x={0} y={0} width={VB} height={VB} fill="#3d2415" />
            <rect x={0} y={0} width={VB} height={VB} fill={`url(#${radial})`} opacity={0.85} />
            {/* Pigment network — hex grid stroke pattern */}
            <rect
              x={0}
              y={0}
              width={VB}
              height={VB}
              fill={`url(#${networkId})`}
              opacity={0.65}
            />
            {/* Globules — irregular darker dots */}
            {Array.from({ length: 18 }).map((_, i) => {
              const rand = prng(spec.seed + 200 + i);
              const a = rand() * Math.PI * 2;
              const dd = rand() * 80 + 10;
              return (
                <circle
                  key={i}
                  cx={100 + Math.cos(a) * dd}
                  cy={100 + Math.sin(a) * dd}
                  r={2 + rand() * 5}
                  fill="#160a04"
                  opacity={0.65}
                />
              );
            })}
            {/* Atypical blue-white veil for high-variance lesions */}
            {(spec.pigmentVariance ?? 0) > 0.7 && (
              <ellipse
                cx={70}
                cy={120}
                rx={42}
                ry={28}
                fill="#9fb3c8"
                opacity={0.32}
                filter={`url(#${blurId})`}
              />
            )}
            {/* Asymmetric pigment overflow */}
            {(spec.asymmetry ?? 0) > 0.5 && (
              <path
                d={blobPath(spec.seed + 33, 130, 90, 30, 0.6)}
                fill="#0d0603"
                opacity={0.55}
                filter={`url(#${blurId})`}
              />
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={className}
      style={{
        aspectRatio: aspect,
        borderRadius: radius,
        overflow: "hidden",
        position: "relative",
        background: skinA,
        border: "1px solid var(--color-line)",
      }}
    >
      <svg
        viewBox={`0 0 ${VB} ${VB * (aspect === "16/11" ? 11 / 16 : aspect === "4/3" ? 3 / 4 : 1)}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          {/* Skin texture: fractal noise displaced to create pore-like grain */}
          <filter id={noiseId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves={2} seed={spec.seed} />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.36
                      0 0 0 0 0.27
                      0 0 0 0 0.2
                      0 0 0 0.08 0"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>

          <filter id={blurId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>

          <radialGradient id={radial} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={skinA} stopOpacity={0} />
            <stop offset="80%" stopColor={skinB} stopOpacity={0.4} />
            <stop offset="100%" stopColor={skinB} stopOpacity={0.85} />
          </radialGradient>

          <radialGradient id={erythId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c25a48" stopOpacity={0.0} />
            <stop offset="100%" stopColor="#c25a48" stopOpacity={0.4} />
          </radialGradient>

          {/* Dermoscopy pigment network: hex stroke pattern */}
          <pattern id={networkId} width="14" height="12.12" patternUnits="userSpaceOnUse">
            <path
              d="M 7 0 L 14 4 L 14 8 L 7 12 L 0 8 L 0 4 Z"
              fill="none"
              stroke="#0e0603"
              strokeWidth="0.9"
              opacity="0.9"
            />
          </pattern>
        </defs>

        {/* Base skin gradient */}
        <rect x={0} y={0} width={VB} height={VB} fill={skinA} />
        <rect x={0} y={0} width={VB} height={VB} fill={`url(#${radial})`} />
        {/* Pore texture */}
        <rect
          x={0}
          y={0}
          width={VB}
          height={VB}
          fill="#000"
          filter={`url(#${noiseId})`}
          opacity={spec.variant === "dermoscopy" ? 0 : 0.5}
        />

        {/* Lesion + variant-specific layers */}
        {renderLesion()}

        {/* Subtle vignette to anchor the photo edge */}
        <rect
          x={0}
          y={0}
          width={VB}
          height={VB}
          fill="url(#vignette)"
          opacity={0.18}
          style={{ mixBlendMode: "multiply" }}
        />
      </svg>

      {children}
    </div>
  );
}
