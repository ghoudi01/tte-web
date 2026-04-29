/**
 * Explainability rules and prompts for trust score outputs.
 * Used by the trust-explainer pipeline for consistent Arabic copy and thresholds.
 */

export const EXPLAINABILITY_THRESHOLDS = {
  lowRiskMin: 70,
  mediumRiskMax: 69,
  mediumRiskMin: 40,
  highRiskMax: 39,
} as const;

export const RISK_LEVEL_LABELS = {
  low: "منخفضة",
  medium: "متوسطة",
  high: "عالية",
} as const;

export const REASON_TEMPLATES = {
  trustScore: (score: number) => `درجة الثقة: ${score}%`,
  rtoCount: (count: number) =>
    count === 0
      ? "لا ارتجاعات سابقة"
      : `عدد الارتجاعات: ${count}`,
  successfulOrders: (count: number) =>
    `عدد الطلبات الناجحة: ${count}`,
  suggestedAction: (level: "low" | "medium" | "high") => {
    const actions: Record<typeof level, string> = {
      low: "يمكن الشحن المباشر مع متابعة عادية.",
      medium: "يُفضّل التحقق عبر واتساب أو طلب عربون حسب السياسة.",
      high: "يُنصح بطلب عربون أو التحقق قبل الشحن.",
    };
    return actions[level];
  },
} as const;

export type ExplainabilityRuleSet = {
  thresholds: typeof EXPLAINABILITY_THRESHOLDS;
  levelLabels: typeof RISK_LEVEL_LABELS;
  reasonTemplates: typeof REASON_TEMPLATES;
};

export const explainabilityRules: ExplainabilityRuleSet = {
  thresholds: EXPLAINABILITY_THRESHOLDS,
  levelLabels: RISK_LEVEL_LABELS,
  reasonTemplates: REASON_TEMPLATES,
};
