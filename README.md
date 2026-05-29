# DermaTrack — prototype web app

**POPIA-aware dermatology tracking.** Patients capture serial skin photos and
log symptoms from home; clinicians review, code, prescribe, and track objective
severity over time — from one continuous record. Built for South African
practice and the POPI Act, from the ground up.

> **All data in this prototype is fictitious.** Patients, ID numbers, photos,
> diagnoses, and prescriptions are entirely synthetic for demonstration only.
> No real personal information is stored or transmitted. This is a concept
> prototype, not medical advice and not production software.

## Live demo

Hosted on GitHub Pages (set after enabling Pages — see *Deploy* below).

Best viewed on a laptop. The patient-side app is rendered inside a phone
mockup on desktop so you see both faces of the system side-by-side.

## What's in here

- **Clinician dashboard** — triage queue, AI-summarised daily priorities,
  patient detail with interactive body map, lesion timeline with before/after
  slider + lightbox, ABCDE + dermoscopy melanoma triage, mSWAT / PASI / BSA
  severity charts, prescribing flow, ICD-10 picker, full audit trail.
- **Patient app** — serial-photo capture, treatment-plan checklist, active
  prescriptions, today's check-in, and a full POPIA data-rights area (access
  log, corrections, consent management, export, delete).
- **Guided tour** — 10-step narrated walk-through that auto-navigates the
  killer flows in ~3 minutes. Launchable from the cover page or any time
  via the floating button.

## Stack

- **Next.js 15 (App Router)** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (design tokens ported from the original interaction
  prototype; see `app/globals.css`)
- Static export — pure HTML/CSS/JS, no Node server needed at runtime
- Pure procedural SVG for all dermatology imagery — no real photos in the
  codebase

> **Supabase scaffolding lives in `lib/supabase/`** for the production build
> path. The prototype bypasses it entirely with an in-memory mock-data layer
> (`lib/mock/`) so the front-end is hostable as a static site. The data-flow
> contract is the same shape as the eventual schema.

## Run locally

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Build the static export

```bash
pnpm build        # outputs to ./out
```

To serve the static build locally:

```bash
python -m http.server -d out 8000
# http://localhost:8000
```

## Deploy to GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds and publishes on every
push to `main`. To enable it:

1. Push this repo to GitHub.
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. The workflow runs on push; the live URL appears in the deployment status.

`NEXT_PUBLIC_BASE_PATH` is derived from the repo name automatically — no
editing required.

## Architecture & production roadmap

`ARCHITECTURE.md` is the source of truth for how this prototype will
evolve into the production build (Slice-1 vertical: patient capture →
clinician review with full auth, consent, and audit).

**Hard rule:** no real patient PHI enters any system until South African
data residency is resolved. Concept-proving uses synthetic data only.

## Use

Proprietary product concept. No licence is granted for reuse,
redistribution, or derivative works.
