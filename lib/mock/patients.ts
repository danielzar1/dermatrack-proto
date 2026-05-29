import type { Patient } from "./types";

/**
 * Synthetic patient roster — 8 patients across the bread-and-butter of a SA
 * dermatology practice plus an urgent melanoma referral. Names, IDs, dates
 * and clinical details are entirely invented. Designed to give the
 * dashboard visual density and to support a guided demo tour that hits the
 * killer flows (CTCL longitudinal tracking, melanoma triage, drug eruption,
 * teledermatology-style review).
 */
export const patients: Patient[] = [
  // ============================================================
  // HF — Hadassah Friedman, 81F, mycosis fungoides (CTCL) — the hero patient.
  // Demonstrates longitudinal tracking, mSWAT severity scoring, multi-lesion
  // body mapping, surveillance protocol, and prescribing.
  // ============================================================
  {
    id: "pt-hf",
    code: "HF",
    name: "Hadassah Friedman",
    age: 81,
    sex: "F",
    folderNumber: "DEMO-0001",
    mobile: "+27 82 *** **41",
    consentOnFile: true,
    urgency: "review",
    needsReviewReason: "New photo of L1 (left upper back) — submitted 2 days ago",
    lastVisit: "11 Apr 2026",
    nextAppt: "Mon 18 May 2026, 14:30",
    skinTone: "fair",
    intake: {
      completed: "Completed 16 May 2026",
      presenting:
        "Persistent itchy rash, upper back and arms, ~3 weeks. Disturbing sleep.",
      areas: "Upper back, both arms",
      allergies: "Penicillin",
      meds: "Losartan 50 mg, Bisoprolol 5 mg, Eltroxin 100 mcg",
      history:
        "HPT, thyroid disease, previous breast Ca (in remission), follicular lymphoma",
      photos: "2 baseline + 4 follow-up images uploaded",
    },
    differential: [
      { code: "L93.0", name: "Discoid lupus" },
      { code: "L43.9", name: "Lichen planus" },
    ],
    confirmed: [
      { code: "C84.0", name: "Mycosis fungoides" },
      { code: "C82.0", name: "Follicular lymphoma grade I" },
    ],
    lesions: [
      {
        id: "les-hf-1",
        num: 1,
        region: "Left upper back",
        type: "Plaque",
        status: "active",
        view: "back",
        coords: { x: 90, y: 105 },
        description:
          "Indurated, slightly scaly erythematous plaque, ~6 cm. Photographed monthly since 17 Feb.",
        clinicianNote:
          "Colour looks a little more active here than last visit. Please take a fresh photo in good light and I'll review before your next appointment.",
        clinicianNoteAuthor: "Dr J Damelin",
        clinicianNoteWhen: "2 days ago",
        timeline: [
          {
            date: "17 Feb 2026",
            label: "Baseline",
            spec: {
              variant: "plaque",
              skinTone: "fair",
              size: 0.62,
              erythema: 0.82,
              scale: 0.45,
              seed: 11,
            },
            severity: 64,
          },
          {
            date: "2 Apr 2026",
            label: "6 wks",
            spec: {
              variant: "plaque",
              skinTone: "fair",
              size: 0.56,
              erythema: 0.7,
              scale: 0.38,
              seed: 11,
            },
            severity: 52,
          },
          {
            date: "30 Apr 2026",
            label: "2 wks ago",
            spec: {
              variant: "plaque",
              skinTone: "fair",
              size: 0.5,
              erythema: 0.6,
              scale: 0.3,
              seed: 11,
            },
            severity: 41,
          },
          {
            date: "14 May 2026",
            label: "Today",
            spec: {
              variant: "plaque",
              skinTone: "fair",
              size: 0.46,
              erythema: 0.55,
              scale: 0.24,
              seed: 11,
            },
            severity: 36,
          },
        ],
      },
      {
        id: "les-hf-2",
        num: 2,
        region: "Right forearm",
        type: "Patch",
        status: "calm",
        view: "front",
        coords: { x: 160, y: 160 },
        description: "Faint hypopigmented patch, settled with phototherapy.",
        timeline: [
          {
            date: "17 Feb 2026",
            label: "Baseline",
            spec: {
              variant: "patch",
              skinTone: "fair",
              size: 0.5,
              erythema: 0.4,
              scale: 0.18,
              seed: 22,
            },
            severity: 38,
          },
          {
            date: "2 Apr 2026",
            label: "6 wks",
            spec: {
              variant: "patch",
              skinTone: "fair",
              size: 0.42,
              erythema: 0.3,
              scale: 0.12,
              seed: 22,
            },
            severity: 24,
          },
          {
            date: "9 May 2026",
            label: "5 days ago",
            spec: {
              variant: "patch",
              skinTone: "fair",
              size: 0.34,
              erythema: 0.18,
              scale: 0.08,
              seed: 22,
            },
            severity: 14,
          },
        ],
      },
      {
        id: "les-hf-3",
        num: 3,
        region: "Left shin",
        type: "Patch",
        status: "calm",
        view: "front",
        coords: { x: 83, y: 284 },
        description: "Stable since baseline, no active disease.",
        timeline: [
          {
            date: "17 Feb 2026",
            label: "Baseline",
            spec: {
              variant: "patch",
              skinTone: "fair",
              size: 0.38,
              erythema: 0.3,
              scale: 0.1,
              seed: 33,
            },
            severity: 22,
          },
          {
            date: "7 May 2026",
            label: "1 wk ago",
            spec: {
              variant: "patch",
              skinTone: "fair",
              size: 0.36,
              erythema: 0.26,
              scale: 0.08,
              seed: 33,
            },
            severity: 18,
          },
        ],
      },
    ],
    prescriptions: [
      {
        id: "rx-hf-1",
        drug: "Clobetasol propionate 0.05% ointment",
        signa: "Apply twice daily to active plaques for 2 weeks, then once daily",
        quantity: "30 g",
        schedule: "S4",
        status: "active",
        date: "14 May 2026",
        prescriber: "Dr J Damelin",
      },
      {
        id: "rx-hf-2",
        drug: "Hydroxyzine 25 mg tablets",
        signa: "1 tablet at night for itch",
        quantity: "30 tablets",
        schedule: "S2",
        status: "active",
        date: "14 Apr 2026",
        prescriber: "Dr J Damelin",
      },
    ],
    protocols: [
      {
        id: "proto-hf-1",
        name: "Skin-directed therapy plan",
        summary:
          "Early-stage mycosis fungoides — topical clobetasol + NB-UVB phototherapy, reviewed monthly.",
        assignedBy: "Dr J Damelin",
        assignedDate: "14 Mar 2026",
        surveillanceNote:
          "Cumulative NB-UVB phototherapy and potent topical steroids need annual full-skin checks and review for skin thinning. Haematology is co-managing the lymphoma — report any new lumps, drenching night sweats or unexplained weight loss.",
        steps: [
          { text: "Baseline staging bloods — FBC, LDH & LFTs", due: "12 Mar 2026", done: true },
          { text: "Baseline skin-surface photography", due: "12 Mar 2026", done: true },
          { text: "Month 1 review — skin exam", due: "11 Apr 2026", done: true },
          { text: "Month 2 review — repeat bloods & skin exam", due: "This week", done: false },
          { text: "Month 3 review — phototherapy response", due: "9 Jun 2026", done: false },
        ],
      },
    ],
    severityTrend: [
      { date: "17 Feb 2026", value: 22, unit: "mSWAT" },
      { date: "12 Mar 2026", value: 19, unit: "mSWAT" },
      { date: "2 Apr 2026", value: 15, unit: "mSWAT" },
      { date: "30 Apr 2026", value: 11, unit: "mSWAT" },
      { date: "14 May 2026", value: 9, unit: "mSWAT" },
    ],
    audit: [
      { when: "14 May 2026 · 09:12", who: "Dr J Damelin", action: "Viewed photo", what: "L1 left upper back · today's photo" },
      { when: "14 May 2026 · 09:13", who: "Dr J Damelin", action: "Added review note", what: "L1 left upper back" },
      { when: "14 May 2026 · 09:14", who: "Dr J Damelin", action: "Issued script", what: "Clobetasol 0.05% ointment" },
      { when: "12 May 2026 · 16:48", who: "Patient (HF)", action: "Uploaded photo", what: "L1 left upper back" },
      { when: "9 May 2026 · 11:02", who: "Patient (HF)", action: "Uploaded photo", what: "L2 right forearm" },
    ],
  },

  // ============================================================
  // PVW — Pieter van Wyk, 58M, suspicious changing mole.
  // URGENT — drives the dermoscopy + ABCDE melanoma triage flow.
  // ============================================================
  {
    id: "pt-pvw",
    code: "PVW",
    name: "Pieter van Wyk",
    age: 58,
    sex: "M",
    folderNumber: "DEMO-0004",
    mobile: "+27 84 *** **02",
    consentOnFile: true,
    urgency: "urgent",
    needsReviewReason: "GP referral — changing pigmented lesion on upper back",
    lastVisit: "First visit",
    nextAppt: "Tue 19 May 2026, 08:30 — urgent slot",
    skinTone: "fair",
    intake: {
      completed: "Completed 15 May 2026 (referring GP)",
      presenting:
        "Dark mole on the upper back, noticed by his wife to be 'darker and uneven' over ~3 months. No bleeding. Not itchy.",
      areas: "Upper back (single lesion)",
      allergies: "None reported",
      meds: "None regular",
      history:
        "Outdoor work for 30+ years (farmer). Fair skin. No personal or family history of melanoma. Two prior 'sunspots' frozen by GP.",
      photos: "1 macro image + 1 dermoscopic image uploaded by referring GP",
    },
    differential: [
      { code: "C43.5", name: "Malignant melanoma of trunk" },
      { code: "D03.5", name: "Melanoma in situ of trunk" },
    ],
    confirmed: [],
    lesions: [
      {
        id: "les-pvw-1",
        num: 1,
        region: "Upper back, left of midline",
        type: "Pigmented lesion — suspicious",
        status: "suspicious",
        view: "back",
        coords: { x: 110, y: 115 },
        description:
          "Asymmetric pigmented lesion, ~8 mm, multiple shades of brown with a darker eccentric zone. Borders are notched on the lateral aspect.",
        clinicianNote:
          "ABCDE score 4/5. Dermoscopy shows atypical pigment network and one blue-grey area. Fast-tracking for excision biopsy this week.",
        clinicianNoteAuthor: "Dr J Damelin",
        clinicianNoteWhen: "today",
        timeline: [
          {
            date: "Feb 2026 (patient phone)",
            label: "3 mo ago",
            spec: {
              variant: "pigmented",
              skinTone: "fair",
              size: 0.36,
              erythema: 0.1,
              scale: 0.05,
              asymmetry: 0.4,
              pigmentVariance: 0.4,
              borderIrregularity: 0.35,
              seed: 41,
            },
          },
          {
            date: "15 May 2026 (referring GP)",
            label: "Today — macro",
            spec: {
              variant: "pigmented",
              skinTone: "fair",
              size: 0.52,
              erythema: 0.1,
              scale: 0.05,
              asymmetry: 0.78,
              pigmentVariance: 0.85,
              borderIrregularity: 0.7,
              seed: 41,
            },
          },
          {
            date: "15 May 2026",
            label: "Today — dermoscopy",
            spec: {
              variant: "dermoscopy",
              skinTone: "fair",
              size: 0.78,
              erythema: 0.1,
              scale: 0,
              asymmetry: 0.8,
              pigmentVariance: 0.9,
              borderIrregularity: 0.75,
              seed: 41,
            },
          },
        ],
      },
    ],
    prescriptions: [],
    protocols: [],
    severityTrend: [],
    audit: [
      { when: "15 May 2026 · 14:22", who: "Dr J Damelin", action: "Viewed referral", what: "PVW · changing mole" },
      { when: "15 May 2026 · 14:24", who: "Dr J Damelin", action: "Triaged", what: "ABCDE = 4/5 · urgent excision" },
    ],
  },

  // ============================================================
  // MD — Moses Dlamini, 64M, cutaneous lupus
  // ============================================================
  {
    id: "pt-md",
    code: "MD",
    name: "Moses Dlamini",
    age: 64,
    sex: "M",
    folderNumber: "DEMO-0002",
    mobile: "+27 73 *** **18",
    consentOnFile: true,
    urgency: "review",
    needsReviewReason: "Itch score climbing — 7/10 this week",
    lastVisit: "21 Apr 2026",
    nextAppt: "Thu 21 May 2026, 10:00",
    skinTone: "dark",
    intake: {
      completed: "Completed 15 May 2026",
      presenting: "Photosensitive facial rash, worse after sun exposure, ~6 weeks.",
      areas: "Face, neck, dorsal hands",
      allergies: "None reported",
      meds: "Amlodipine 5 mg, Metformin 850 mg",
      history: "Type 2 diabetes (HbA1c 7.4%), hypertension",
      photos: "3 images uploaded",
    },
    differential: [
      { code: "L93.0", name: "Discoid lupus" },
      { code: "L56.8", name: "Polymorphic light eruption" },
    ],
    confirmed: [{ code: "L93.0", name: "Cutaneous lupus" }],
    lesions: [
      {
        id: "les-md-1",
        num: 1,
        region: "Right cheek",
        type: "Plaque",
        status: "active",
        view: "front",
        coords: { x: 115, y: 34 },
        description: "Annular erythematous plaque with central atrophy.",
        timeline: [
          {
            date: "21 Apr 2026",
            label: "3 wks ago",
            spec: {
              variant: "plaque",
              skinTone: "dark",
              size: 0.5,
              erythema: 0.6,
              scale: 0.25,
              seed: 51,
            },
            severity: 48,
          },
          {
            date: "13 May 2026",
            label: "Today",
            spec: {
              variant: "plaque",
              skinTone: "dark",
              size: 0.56,
              erythema: 0.72,
              scale: 0.32,
              seed: 51,
            },
            severity: 58,
          },
        ],
      },
      {
        id: "les-md-2",
        num: 2,
        region: "Dorsum of hands",
        type: "Patch",
        status: "active",
        view: "front",
        coords: { x: 40, y: 200 },
        description: "Hyperpigmented patches, sun-exposed distribution.",
        timeline: [
          {
            date: "13 May 2026",
            label: "Today",
            spec: {
              variant: "patch",
              skinTone: "dark",
              size: 0.46,
              erythema: 0.35,
              scale: 0.12,
              seed: 52,
            },
            severity: 32,
          },
        ],
      },
    ],
    prescriptions: [
      {
        id: "rx-md-1",
        drug: "Hydroxychloroquine 200 mg tablets",
        signa: "1 tablet twice daily with food",
        quantity: "60 tablets",
        schedule: "S3",
        status: "active",
        date: "21 Apr 2026",
        prescriber: "Dr J Damelin",
      },
    ],
    protocols: [
      {
        id: "proto-md-1",
        name: "Cutaneous lupus plan",
        summary:
          "Strict photoprotection + topical class-II steroid + hydroxychloroquine. Baseline eye check arranged.",
        assignedBy: "Dr J Damelin",
        assignedDate: "21 Apr 2026",
        steps: [
          { text: "Baseline bloods — FBC, U&E, LFTs, ANA, anti-Ro/La", due: "21 Apr 2026", done: true },
          { text: "Ophthalmology baseline (hydroxychloroquine)", due: "5 May 2026", done: true },
          { text: "Month 1 skin review", due: "This week", done: false },
          { text: "Annual eye review", due: "Apr 2027", done: false },
        ],
      },
    ],
    severityTrend: [
      { date: "21 Apr 2026", value: 32, unit: "BSA" },
      { date: "7 May 2026", value: 35, unit: "BSA" },
      { date: "13 May 2026", value: 38, unit: "BSA" },
    ],
    audit: [
      { when: "13 May 2026 · 17:30", who: "Patient (MD)", action: "Logged symptom", what: "Itch score 7/10" },
      { when: "13 May 2026 · 17:31", who: "Patient (MD)", action: "Uploaded photo", what: "L1 right cheek" },
    ],
  },

  // ============================================================
  // AB — Annelize Botha, 52F, drug eruption
  // ============================================================
  {
    id: "pt-ab",
    code: "AB",
    name: "Annelize Botha",
    age: 52,
    sex: "F",
    folderNumber: "DEMO-0003",
    mobile: "+27 82 *** **77",
    consentOnFile: true,
    urgency: "review",
    needsReviewReason: "3 new spots logged in past 24 hours",
    lastVisit: "13 May 2026",
    nextAppt: "Fri 22 May 2026, 11:15",
    skinTone: "med",
    intake: {
      completed: "Completed 14 May 2026",
      presenting:
        "Widespread itchy eruption 5 days after starting a new antibiotic (amoxicillin) for a UTI.",
      areas: "Trunk, both arms, thighs",
      allergies: "Sulfonamides (current reaction under investigation)",
      meds: "Amoxicillin (recently started), HCTZ 12.5 mg",
      history: "Recurrent urinary-tract infections",
      photos: "4 images uploaded",
    },
    differential: [
      { code: "L27.0", name: "Drug eruption" },
      { code: "L51.9", name: "Erythema multiforme" },
    ],
    confirmed: [],
    lesions: [
      {
        id: "les-ab-1",
        num: 1,
        region: "Anterior trunk",
        type: "Maculopapular eruption",
        status: "active",
        view: "front",
        coords: { x: 100, y: 110 },
        description:
          "Confluent maculopapular eruption, blanching, no mucosal involvement.",
        timeline: [
          {
            date: "13 May 2026",
            label: "Yesterday",
            spec: {
              variant: "inflammatory",
              skinTone: "med",
              size: 0.7,
              erythema: 0.75,
              scale: 0.1,
              seed: 61,
            },
            severity: 60,
          },
          {
            date: "14 May 2026",
            label: "Today",
            spec: {
              variant: "inflammatory",
              skinTone: "med",
              size: 0.78,
              erythema: 0.82,
              scale: 0.1,
              seed: 61,
            },
            severity: 68,
          },
        ],
      },
    ],
    prescriptions: [
      {
        id: "rx-ab-1",
        drug: "Cetirizine 10 mg tablets",
        signa: "1 tablet at night",
        quantity: "14 tablets",
        schedule: "S2",
        status: "active",
        date: "13 May 2026",
        prescriber: "Dr J Damelin",
      },
    ],
    protocols: [],
    severityTrend: [
      { date: "13 May 2026", value: 28, unit: "BSA" },
      { date: "14 May 2026", value: 34, unit: "BSA" },
    ],
    audit: [
      { when: "14 May 2026 · 08:14", who: "Patient (AB)", action: "Uploaded photo", what: "3 new spots — arms" },
      { when: "13 May 2026 · 15:02", who: "Dr J Damelin", action: "Issued script", what: "Cetirizine 10 mg" },
    ],
  },

  // ============================================================
  // LM — Lerato Mokoena, 34F, atopic dermatitis — stable monthly review
  // ============================================================
  {
    id: "pt-lm",
    code: "LM",
    name: "Lerato Mokoena",
    age: 34,
    sex: "F",
    folderNumber: "DEMO-0005",
    mobile: "+27 71 *** **05",
    consentOnFile: true,
    urgency: "routine",
    lastVisit: "5 May 2026",
    nextAppt: "Mon 2 Jun 2026, 09:30",
    skinTone: "dark",
    intake: {
      completed: "Completed 5 May 2026",
      presenting: "Chronic atopic dermatitis, flares with stress. Antecubital fossae worst.",
      areas: "Antecubital fossae, popliteal fossae, neck",
      allergies: "House dust mite (positive skin prick)",
      meds: "Cetirizine 10 mg PRN",
      history: "Childhood asthma, allergic rhinitis. Mother also atopic.",
      photos: "Baseline + 1 follow-up",
    },
    differential: [],
    confirmed: [{ code: "L20.9", name: "Atopic dermatitis" }],
    lesions: [
      {
        id: "les-lm-1",
        num: 1,
        region: "Left antecubital fossa",
        type: "Lichenified plaque",
        status: "calm",
        view: "front",
        coords: { x: 44, y: 140 },
        description: "Lichenification with post-inflammatory hyperpigmentation. Settled.",
        timeline: [
          {
            date: "5 May 2026",
            label: "Last visit",
            spec: {
              variant: "plaque",
              skinTone: "dark",
              size: 0.42,
              erythema: 0.35,
              scale: 0.25,
              seed: 71,
            },
            severity: 30,
          },
        ],
      },
    ],
    prescriptions: [
      {
        id: "rx-lm-1",
        drug: "Tacrolimus 0.1% ointment",
        signa: "Apply twice daily to active areas",
        quantity: "30 g",
        schedule: "S4",
        status: "active",
        date: "5 May 2026",
        prescriber: "Dr J Damelin",
      },
    ],
    protocols: [
      {
        id: "proto-lm-1",
        name: "Atopic eczema maintenance",
        summary:
          "Twice-weekly tacrolimus weekend therapy + daily emollient, written eczema action plan.",
        assignedBy: "Dr J Damelin",
        assignedDate: "12 Feb 2026",
        steps: [
          { text: "Baseline SCORAD", due: "12 Feb 2026", done: true },
          { text: "3-month review", due: "12 May 2026", done: true },
          { text: "6-month review", due: "12 Aug 2026", done: false },
        ],
      },
    ],
    severityTrend: [
      { date: "12 Feb 2026", value: 41, unit: "SCORAD" },
      { date: "12 Mar 2026", value: 28, unit: "SCORAD" },
      { date: "5 May 2026", value: 19, unit: "SCORAD" },
    ],
    audit: [],
  },

  // ============================================================
  // JN — Jaden Naidoo, 19M, severe acne on isotretinoin — monthly bloods
  // ============================================================
  {
    id: "pt-jn",
    code: "JN",
    name: "Jaden Naidoo",
    age: 19,
    sex: "M",
    folderNumber: "DEMO-0006",
    mobile: "+27 79 *** **66",
    consentOnFile: true,
    urgency: "routine",
    needsReviewReason: "Month-4 bloods due",
    lastVisit: "8 May 2026",
    nextAppt: "Tue 26 May 2026, 16:00",
    skinTone: "olive",
    intake: {
      completed: "Completed 8 May 2026",
      presenting: "Nodulocystic acne, face and upper back. Scarring concern.",
      areas: "Cheeks, jawline, chest, upper back",
      allergies: "None",
      meds: "Isotretinoin 40 mg daily",
      history: "Nil significant. Mood screening ongoing.",
      photos: "Monthly serial photos",
    },
    differential: [],
    confirmed: [{ code: "L70.0", name: "Acne vulgaris (severe)" }],
    lesions: [
      {
        id: "les-jn-1",
        num: 1,
        region: "Right cheek",
        type: "Papulopustular acne",
        status: "calm",
        view: "front",
        coords: { x: 115, y: 38 },
        description: "Marked improvement on isotretinoin. Mostly post-inflammatory erythema now.",
        timeline: [
          {
            date: "8 Feb 2026",
            label: "Baseline",
            spec: {
              variant: "acne",
              skinTone: "olive",
              size: 0.6,
              erythema: 0.78,
              scale: 0.18,
              seed: 81,
            },
            severity: 72,
          },
          {
            date: "8 Apr 2026",
            label: "Month 2",
            spec: {
              variant: "acne",
              skinTone: "olive",
              size: 0.48,
              erythema: 0.5,
              scale: 0.1,
              seed: 81,
            },
            severity: 42,
          },
          {
            date: "8 May 2026",
            label: "Month 3",
            spec: {
              variant: "acne",
              skinTone: "olive",
              size: 0.36,
              erythema: 0.32,
              scale: 0.06,
              seed: 81,
            },
            severity: 24,
          },
        ],
      },
    ],
    prescriptions: [
      {
        id: "rx-jn-1",
        drug: "Isotretinoin 40 mg capsules",
        signa: "1 capsule daily with food. Pregnancy prevention not applicable.",
        quantity: "30 capsules",
        schedule: "S4",
        status: "active",
        date: "8 May 2026",
        prescriber: "Dr J Damelin",
      },
    ],
    protocols: [
      {
        id: "proto-jn-1",
        name: "Isotretinoin course",
        summary: "6-month course at 0.5–1 mg/kg/day, monthly bloods + mood check.",
        assignedBy: "Dr J Damelin",
        assignedDate: "8 Feb 2026",
        steps: [
          { text: "Baseline bloods + lipids", due: "8 Feb 2026", done: true },
          { text: "Month 1 bloods", due: "8 Mar 2026", done: true },
          { text: "Month 2 bloods", due: "8 Apr 2026", done: true },
          { text: "Month 3 bloods", due: "8 May 2026", done: true },
          { text: "Month 4 bloods", due: "Due this week", done: false },
          { text: "End-of-course review", due: "8 Aug 2026", done: false },
        ],
      },
    ],
    severityTrend: [
      { date: "8 Feb 2026", value: 38, unit: "AcneSev" },
      { date: "8 Mar 2026", value: 28, unit: "AcneSev" },
      { date: "8 Apr 2026", value: 18, unit: "AcneSev" },
      { date: "8 May 2026", value: 11, unit: "AcneSev" },
    ],
    audit: [],
  },

  // ============================================================
  // SK — Sipho Khumalo, 41M, psoriasis vulgaris on methotrexate
  // ============================================================
  {
    id: "pt-sk",
    code: "SK",
    name: "Sipho Khumalo",
    age: 41,
    sex: "M",
    folderNumber: "DEMO-0007",
    mobile: "+27 83 *** **23",
    consentOnFile: true,
    urgency: "routine",
    lastVisit: "29 Apr 2026",
    nextAppt: "Wed 28 May 2026, 13:00",
    skinTone: "dark",
    intake: {
      completed: "Completed 29 Apr 2026",
      presenting: "Plaque psoriasis on elbows, knees, scalp. PASI improving on methotrexate.",
      areas: "Elbows, knees, scalp, lower back",
      allergies: "None",
      meds: "Methotrexate 15 mg weekly + folic acid",
      history: "Hypertension, NAFLD (mild).",
      photos: "Quarterly serial photos",
    },
    differential: [],
    confirmed: [{ code: "L40.0", name: "Psoriasis vulgaris" }],
    lesions: [
      {
        id: "les-sk-1",
        num: 1,
        region: "Right elbow",
        type: "Plaque",
        status: "active",
        view: "back",
        coords: { x: 38, y: 130 },
        description: "Silvery scale, well-demarcated.",
        timeline: [
          {
            date: "12 Feb 2026",
            label: "Baseline",
            spec: {
              variant: "scaly",
              skinTone: "dark",
              size: 0.55,
              erythema: 0.7,
              scale: 0.85,
              seed: 91,
            },
            severity: 58,
          },
          {
            date: "12 Apr 2026",
            label: "2 mo",
            spec: {
              variant: "scaly",
              skinTone: "dark",
              size: 0.46,
              erythema: 0.55,
              scale: 0.6,
              seed: 91,
            },
            severity: 36,
          },
        ],
      },
    ],
    prescriptions: [
      {
        id: "rx-sk-1",
        drug: "Methotrexate 2.5 mg tablets",
        signa: "6 tablets once weekly (15 mg). Folic acid 5 mg the next day.",
        quantity: "30 tablets",
        schedule: "S4",
        status: "active",
        date: "29 Apr 2026",
        prescriber: "Dr J Damelin",
      },
    ],
    protocols: [
      {
        id: "proto-sk-1",
        name: "Methotrexate maintenance",
        summary: "Methotrexate 15 mg/week + folic acid, 3-monthly bloods (FBC, U&E, LFTs).",
        assignedBy: "Dr J Damelin",
        assignedDate: "12 Feb 2026",
        steps: [
          { text: "Baseline FBC, LFTs, U&E, hep screen", due: "12 Feb 2026", done: true },
          { text: "Month 1 bloods", due: "12 Mar 2026", done: true },
          { text: "Month 3 bloods", due: "12 May 2026", done: true },
          { text: "Month 6 bloods", due: "12 Aug 2026", done: false },
        ],
      },
    ],
    severityTrend: [
      { date: "12 Feb 2026", value: 14.2, unit: "PASI" },
      { date: "12 Mar 2026", value: 11.1, unit: "PASI" },
      { date: "12 Apr 2026", value: 7.6, unit: "PASI" },
      { date: "29 Apr 2026", value: 5.9, unit: "PASI" },
    ],
    audit: [],
  },

  // ============================================================
  // RE — Refilwe Ndlovu, 28F, vitiligo on phototherapy
  // ============================================================
  {
    id: "pt-re",
    code: "RE",
    name: "Refilwe Ndlovu",
    age: 28,
    sex: "F",
    folderNumber: "DEMO-0008",
    mobile: "+27 76 *** **89",
    consentOnFile: true,
    urgency: "routine",
    lastVisit: "30 Apr 2026",
    nextAppt: "Mon 1 Jun 2026, 14:00",
    skinTone: "dark",
    intake: {
      completed: "Completed 30 Apr 2026",
      presenting: "Vitiligo on hands and around eyes. Slow repigmentation on NB-UVB.",
      areas: "Periorbital, dorsum of hands",
      allergies: "None",
      meds: "Topical tacrolimus",
      history: "Autoimmune thyroid (TPO antibodies positive).",
      photos: "Monthly photos",
    },
    differential: [],
    confirmed: [{ code: "L80", name: "Vitiligo" }],
    lesions: [
      {
        id: "les-re-1",
        num: 1,
        region: "Dorsum of left hand",
        type: "Depigmented patch",
        status: "active",
        view: "front",
        coords: { x: 40, y: 200 },
        description: "Depigmented patch, slowly repigmenting peripherally.",
        timeline: [
          {
            date: "30 Apr 2026",
            label: "Last visit",
            spec: {
              variant: "vitiligo",
              skinTone: "dark",
              size: 0.52,
              erythema: 0,
              scale: 0,
              seed: 101,
            },
            severity: 40,
          },
        ],
      },
    ],
    prescriptions: [
      {
        id: "rx-re-1",
        drug: "Tacrolimus 0.1% ointment",
        signa: "Apply twice daily to affected areas",
        quantity: "30 g",
        schedule: "S4",
        status: "active",
        date: "30 Apr 2026",
        prescriber: "Dr J Damelin",
      },
    ],
    protocols: [
      {
        id: "proto-re-1",
        name: "Vitiligo phototherapy plan",
        summary: "NB-UVB 2× weekly + topical tacrolimus. Quarterly review of response.",
        assignedBy: "Dr J Damelin",
        assignedDate: "5 Feb 2026",
        steps: [
          { text: "Baseline TFTs, ANA", due: "5 Feb 2026", done: true },
          { text: "3-month review", due: "5 May 2026", done: true },
          { text: "6-month review", due: "5 Aug 2026", done: false },
        ],
      },
    ],
    severityTrend: [
      { date: "5 Feb 2026", value: 7.5, unit: "BSA" },
      { date: "30 Apr 2026", value: 6.2, unit: "BSA" },
    ],
    audit: [],
  },
];

export function getPatient(id: string): Patient | undefined {
  return patients.find((p) => p.id === id);
}

export function getPatientByCode(code: string): Patient | undefined {
  return patients.find((p) => p.code === code);
}
