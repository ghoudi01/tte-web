/**
 * Tunisia regions and cities for shipping and regional logic.
 * Used by shipping-recommendation and evaluation.
 */

export type RegionEntry = {
  id: string;
  nameAr: string;
  nameEn: string;
  /** Governorate or main area */
  governorate?: string;
  /** Typical coverage: national, coastal, capital, etc. */
  coverage?: string;
  /** Sample postal or zone code for matching */
  codePrefix?: string;
};

export const TUNISIA_REGIONS: RegionEntry[] = [
  { id: "tunis", nameAr: "تونس", nameEn: "Tunis", governorate: "تونس", coverage: "capital", codePrefix: "10" },
  { id: "sfax", nameAr: "صفاقس", nameEn: "Sfax", governorate: "صفاقس", coverage: "coastal" },
  { id: "sousse", nameAr: "سوسة", nameEn: "Sousse", governorate: "المنستير", coverage: "coastal" },
  { id: "nabeul", nameAr: "نابل", nameEn: "Nabeul", governorate: "نابل", coverage: "coastal" },
  { id: "ben-arous", nameAr: "بن عروس", nameEn: "Ben Arous", governorate: "بن عروس", coverage: "capital" },
  { id: "ariana", nameAr: "أريانة", nameEn: "Ariana", governorate: "أريانة", coverage: "capital" },
  { id: "manouba", nameAr: "منوبة", nameEn: "Manouba", governorate: "منوبة", coverage: "capital" },
  { id: "monastir", nameAr: "المنستير", nameEn: "Monastir", governorate: "المنستير", coverage: "coastal" },
  { id: "mahdia", nameAr: "المهدية", nameEn: "Mahdia", governorate: "المهدية", coverage: "coastal" },
  { id: "gabes", nameAr: "قابس", nameEn: "Gabes", governorate: "قابس", coverage: "coastal" },
  { id: "kairouan", nameAr: "القيروان", nameEn: "Kairouan", governorate: "القيروان", coverage: "national" },
  { id: "beja", nameAr: "باجة", nameEn: "Beja", governorate: "باجة", coverage: "national" },
  { id: "bizette", nameAr: "بنزرت", nameEn: "Bizerte", governorate: "بنزرت", coverage: "coastal" },
  { id: "gafsa", nameAr: "قفصة", nameEn: "Gafsa", governorate: "قفصة", coverage: "national" },
  { id: "medenine", nameAr: "مدنين", nameEn: "Medenine", governorate: "مدنين", coverage: "national" },
  { id: "kebili", nameAr: "قبلي", nameEn: "Kebili", governorate: "قبلي", coverage: "national" },
  { id: "tozeur", nameAr: "توزر", nameEn: "Tozeur", governorate: "توزر", coverage: "national" },
  { id: "siliana", nameAr: "سليانة", nameEn: "Siliana", governorate: "سليانة", coverage: "national" },
  { id: "kef", nameAr: "الكاف", nameEn: "Kef", governorate: "الكاف", coverage: "national" },
  { id: "jendouba", nameAr: "جندوبة", nameEn: "Jendouba", governorate: "جندوبة", coverage: "national" },
  { id: "zaghouan", nameAr: "زغوان", nameEn: "Zaghouan", governorate: "زغوان", coverage: "national" },
];

/** Normalized region key for matching (e.g. from user input) */
export function normalizeRegionKey(input: string): string {
  const s = input.trim().toLowerCase().replace(/\s+/g, "-");
  const entry = TUNISIA_REGIONS.find(
    r =>
      r.nameEn.toLowerCase() === s ||
      r.nameAr === input.trim() ||
      r.id === s ||
      r.nameEn.toLowerCase().includes(s) ||
      r.id.includes(s)
  );
  return entry?.id ?? s;
}

/** Check if region is in capital area (greater Tunis) for express shipping */
export function isCapitalRegion(regionIdOrName: string): boolean {
  const key = normalizeRegionKey(regionIdOrName);
  return ["tunis", "ben-arous", "ariana", "manouba"].includes(key);
}
