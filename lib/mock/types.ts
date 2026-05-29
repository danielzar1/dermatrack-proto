/**
 * Mock-data types for the prototype. Synthetic only — no real PHI.
 * These intentionally mirror the shape we'd want in the real schema so the
 * UI doesn't have to be rewritten when the Supabase data layer is wired up
 * (ARCHITECTURE.md §5).
 */

export type Sex = "F" | "M" | "Other";

export type Urgency = "routine" | "review" | "urgent";

export type LesionStatus = "active" | "calm" | "resolved" | "suspicious";

export type BodyView = "front" | "back";

export type Diagnosis = {
  code: string; // ICD-10
  name: string;
};

export type SkinTone = "fair" | "med" | "olive" | "dark";

/**
 * Photo "spec" — the synthetic SVG dermatology art is rendered from these
 * parameters so each timepoint shows realistic change over time.
 */
export type PhotoSpec = {
  variant:
    | "plaque" // raised, erythematous, sometimes scaly
    | "patch" // flat, hypo- or hyper-pigmented
    | "pigmented" // pigmented lesion / mole
    | "inflammatory" // erythematous, papular, drug-eruption-like
    | "scaly" // psoriasis-like, silvery scale
    | "vitiligo" // depigmented patch
    | "acne" // papulopustular
    | "dermoscopy"; // dermoscopic view
  skinTone: SkinTone;
  size: number; // 0..1 — relative to frame
  erythema: number; // 0..1
  scale: number; // 0..1
  asymmetry?: number; // 0..1 (pigmented lesions)
  pigmentVariance?: number; // 0..1 — colour heterogeneity (ABCDE 'C')
  borderIrregularity?: number; // 0..1 (ABCDE 'B')
  seed: number; // deterministic shape
};

export type LesionPhoto = {
  date: string; // ISO-ish, display-formatted
  label: string; // "Today", "2 wks", "Baseline"
  spec: PhotoSpec;
  severity?: number; // 0..100 — composite local score
};

export type Lesion = {
  id: string;
  num: number; // L1, L2, ... (persists for life of patient)
  region: string; // human-readable body region
  type: string; // "Plaque", "Patch", "Pigmented lesion", etc.
  status: LesionStatus;
  view: BodyView;
  coords: { x: number; y: number }; // SVG viewBox 200×360
  description?: string;
  clinicianNote?: string;
  clinicianNoteAuthor?: string;
  clinicianNoteWhen?: string;
  timeline: LesionPhoto[]; // chronological — oldest first
};

export type Prescription = {
  id: string;
  drug: string;
  strength?: string;
  signa: string; // free-text sig
  quantity?: string;
  schedule?: string; // SA drug schedule (S0–S6)
  status: "active" | "completed" | "discontinued";
  date: string; // dispense / issue date
  prescriber: string;
};

export type ProtocolStep = {
  text: string;
  due: string;
  done: boolean;
};

export type Protocol = {
  id: string;
  name: string;
  summary: string;
  assignedBy: string;
  assignedDate: string;
  steps: ProtocolStep[];
  surveillanceNote?: string;
};

export type SeverityPoint = {
  date: string;
  value: number; // raw score
  unit: "mSWAT" | "PASI" | "SCORAD" | "BSA" | "AcneSev";
};

export type AuditEntry = {
  when: string;
  who: string;
  action: string;
  what: string; // human-readable target
};

export type PreConsultIntake = {
  completed: string;
  presenting: string;
  areas: string;
  allergies: string;
  meds: string;
  history: string;
  photos: string;
};

export type Patient = {
  id: string;
  code: string; // initials, e.g. "HF"
  name: string;
  age: number;
  sex: Sex;
  folderNumber: string;
  mobile: string;
  consentOnFile: boolean;
  urgency: Urgency;
  needsReviewReason?: string;
  lastVisit: string;
  nextAppt?: string;
  skinTone: SkinTone;
  intake: PreConsultIntake;
  differential: Diagnosis[];
  confirmed: Diagnosis[];
  lesions: Lesion[];
  prescriptions: Prescription[];
  protocols: Protocol[];
  severityTrend: SeverityPoint[];
  audit: AuditEntry[];
};

export type IcdCode = {
  code: string;
  name: string;
  fav?: boolean;
};
