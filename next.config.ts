import type { NextConfig } from "next";

// Allow GitHub Pages to serve from a sub-path (e.g. /dermatrack-prototype).
// Set NEXT_PUBLIC_BASE_PATH at build time. Empty / unset = root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: false,

  // Static export — produces an `out/` directory of pure HTML/CSS/JS
  // suitable for GitHub Pages, Netlify, S3, etc. No Node server needed.
  output: "export",
  // Trailing slashes keep nested routes resolvable when served by Pages,
  // which prefers /clinician/patients/pt-hf/index.html over a 404.
  trailingSlash: true,
  // next/image's loader needs a server; switch to plain <img> output.
  images: { unoptimized: true },
  // Sub-path support for project pages (https://<user>.github.io/<repo>/).
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
