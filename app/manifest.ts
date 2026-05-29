import type { MetadataRoute } from "next";

// Required when using `output: 'export'` so the manifest is generated at
// build time and emitted into the static output.
export const dynamic = "force-static";

// Minimal installable-PWA manifest. Icons are a TODO before any real
// rollout (no placeholder assets committed). Offline/service-worker is
// deliberately deferred — see ARCHITECTURE.md §8.
export default function manifest(): MetadataRoute.Manifest {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return {
    name: "DermaTrack",
    short_name: "DermaTrack",
    description: "POPIA-aware dermatology tracking.",
    start_url: `${base}/`,
    scope: `${base}/`,
    display: "standalone",
    background_color: "#f1f0ec",
    theme_color: "#213a5c",
  };
}
