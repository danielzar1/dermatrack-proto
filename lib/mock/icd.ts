import type { IcdCode } from "./types";

/**
 * ICD-10 codes commonly used in a SA dermatology practice. The `fav` flag
 * marks the clinician's frequently-used codes so they surface first in the
 * picker. Order in this list = display order within each group.
 */
export const icdCodes: IcdCode[] = [
  // Inflammatory / common
  { code: "L40.0", name: "Psoriasis vulgaris", fav: true },
  { code: "L20.9", name: "Atopic dermatitis, unspecified", fav: true },
  { code: "L70.0", name: "Acne vulgaris", fav: true },
  { code: "L71.9", name: "Rosacea, unspecified", fav: true },
  { code: "L30.9", name: "Dermatitis, unspecified" },
  { code: "L50.9", name: "Urticaria, unspecified" },
  { code: "L43.9", name: "Lichen planus, unspecified" },
  { code: "L27.0", name: "Generalised skin eruption due to drugs" },
  { code: "L51.9", name: "Erythema multiforme, unspecified" },

  // Pigmentation / immune
  { code: "L80", name: "Vitiligo" },
  { code: "L93.0", name: "Discoid lupus erythematosus" },
  { code: "L93.2", name: "Other local lupus erythematosus" },
  { code: "L56.8", name: "Polymorphic light eruption" },
  { code: "L63.0", name: "Alopecia (capitis) totalis" },
  { code: "L65.9", name: "Nonscarring hair loss, unspecified" },

  // Bullous / autoimmune
  { code: "L12.0", name: "Bullous pemphigoid" },
  { code: "L10.0", name: "Pemphigus vulgaris" },

  // Skin cancer / pre-malignant
  { code: "C43.5", name: "Malignant melanoma of trunk" },
  { code: "C43.9", name: "Malignant melanoma of skin, unspecified" },
  { code: "C44.9", name: "Other malignant neoplasms of skin, unspecified" },
  { code: "D03.5", name: "Melanoma in situ of trunk" },
  { code: "L57.0", name: "Actinic keratosis" },

  // CTCL / lymphoma
  { code: "C84.0", name: "Mycosis fungoides" },
  { code: "C84.1", name: "Sezary disease" },
  { code: "C82.0", name: "Follicular lymphoma grade I" },

  // Infectious
  { code: "B07.9", name: "Viral wart, unspecified" },
  { code: "B35.4", name: "Tinea corporis" },
  { code: "L08.9", name: "Local infection of skin, unspecified" },
];

export function findIcd(query: string): IcdCode[] {
  const q = query.trim().toLowerCase();
  if (!q) return icdCodes;
  return icdCodes.filter(
    (c) =>
      c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q),
  );
}
