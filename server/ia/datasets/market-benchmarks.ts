/**
 * Tunisia market patterns and benchmarks for evaluation and tuning.
 * Used by growth-tips and engine calibration.
 */

export type SegmentBenchmark = {
  segment: string;
  /** Average RTO rate (0–100) in this segment */
  avgRtoRate: number;
  /** Typical success rate (0–100) */
  avgSuccessRate: number;
  /** Suggested trust threshold for deposit in this segment */
  suggestedDepositThreshold: number;
  /** Sample size or note */
  note?: string;
};

/** Benchmarks by merchant segment (e.g. size, category) */
export const SEGMENT_BENCHMARKS: SegmentBenchmark[] = [
  {
    segment: "starter",
    avgRtoRate: 14,
    avgSuccessRate: 78,
    suggestedDepositThreshold: 45,
    note: "أقل من 100 طلب/شهر",
  },
  {
    segment: "growth",
    avgRtoRate: 11,
    avgSuccessRate: 82,
    suggestedDepositThreshold: 40,
    note: "100–500 طلب/شهر",
  },
  {
    segment: "scale",
    avgRtoRate: 9,
    avgSuccessRate: 86,
    suggestedDepositThreshold: 38,
    note: "أكثر من 500 طلب/شهر",
  },
];

/** Typical order amount ranges (TND) for Tunisia e-commerce */
export const ORDER_AMOUNT_RANGES = {
  low: { min: 0, max: 99 },
  medium: { min: 100, max: 299 },
  high: { min: 300, max: 999 },
  premium: { min: 1000, max: 9999 },
} as const;

/** Default market RTO benchmark (percentage) for comparison */
export const MARKET_DEFAULT_RTO = 12;

/** Default market success rate (percentage) */
export const MARKET_DEFAULT_SUCCESS_RATE = 82;

export type TunisiaPhoneSample = {
  /** Masked or sample prefix */
  prefix: string;
  regionHint?: string;
  /** Typical risk segment in demos */
  riskSegment?: "low" | "medium" | "high";
};

/** Sample phone prefixes / patterns for tests and demos (Tunisia) */
export const TUNISIA_PHONE_SAMPLES: TunisiaPhoneSample[] = [
  { prefix: "216", regionHint: "Tunisia", riskSegment: "medium" },
  { prefix: "21", regionHint: "Tunis area", riskSegment: "low" },
  { prefix: "25", regionHint: "Sfax area", riskSegment: "medium" },
  { prefix: "27", regionHint: "Sousse / Monastir", riskSegment: "medium" },
];
