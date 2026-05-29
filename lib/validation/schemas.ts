import { z } from "zod";

// Shared validation — used on both client (forms) and server (boundary).
// ARCHITECTURE.md §9: Zod at every external boundary; trust types internally.

export const consentTypeSchema = z.enum([
  "store_phi",
  "share_with_clinician",
  "reminders",
  "research",
]);
export type ConsentType = z.infer<typeof consentTypeSchema>;

export const recordConsentSchema = z.object({
  type: consentTypeSchema,
  granted: z.boolean(),
  policyVersion: z.string().min(1),
});
export type RecordConsentInput = z.infer<typeof recordConsentSchema>;

export const createLesionSchema = z.object({
  bodyRegion: z.string().min(1).max(120),
  lesionType: z.string().max(120).optional(),
});
export type CreateLesionInput = z.infer<typeof createLesionSchema>;

export const addReviewSchema = z.object({
  lesionId: z.string().uuid(),
  note: z.string().min(1).max(4000),
});
export type AddReviewInput = z.infer<typeof addReviewSchema>;
