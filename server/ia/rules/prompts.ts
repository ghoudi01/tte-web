/**
 * Prompt templates for explainability outputs (Arabic).
 * Used when generating human-readable explanations for merchants.
 */

export const EXPLAINABILITY_PROMPTS = {
  summaryPrefix: "ملخص درجة الثقة:",
  factorsTitle: "عوامل القرار:",
  suggestedActionTitle: "الإجراء المقترح:",
  noHistory: "لا يوجد سجل سابق لهذا الرقم.",
  lowRiskSummary: "مخاطر منخفضة — سجل إيجابي أو درجة ثقة جيدة.",
  mediumRiskSummary:
    "مخاطر متوسطة — يُفضّل التحقق أو عربون حسب سياسة المتجر.",
  highRiskSummary:
    "مخاطر عالية — يُنصح بالتحقق المسبق أو طلب عربون لتقليل الخسارة.",
} as const;

export type ExplainabilityPrompts = typeof EXPLAINABILITY_PROMPTS;
