/**
 * IA pipeline: Trust score explainability.
 * Aligns with plugins/trust-explainer and RoadmapIdeas "شرح سبب درجة الثقة".
 * Uses rules from ../rules for thresholds and prompts.
 */

import {
  EXPLAINABILITY_THRESHOLDS,
  RISK_LEVEL_LABELS,
  REASON_TEMPLATES,
  EXPLAINABILITY_PROMPTS,
} from "../rules";

export type TrustExplanationInput = {
  trustScore: number;
  rtoCount?: number;
  successfulOrders?: number;
};

export type TrustExplanation = {
  level: string;
  riskLevel: "low" | "medium" | "high";
  reasons: string[];
  suggestedAction: string;
  summaryPrompt?: string;
};

export function explainTrust(input: TrustExplanationInput): TrustExplanation {
  const { lowRiskMin, mediumRiskMin, highRiskMax } = EXPLAINABILITY_THRESHOLDS;
  const score = input.trustScore;
  const rtoCount = input.rtoCount ?? 0;
  const successfulOrders = input.successfulOrders ?? 0;

  const riskLevel: "low" | "medium" | "high" =
    score >= lowRiskMin ? "low" : score >= mediumRiskMin ? "medium" : "high";
  const level = RISK_LEVEL_LABELS[riskLevel];

  const reasons: string[] = [
    REASON_TEMPLATES.trustScore(score),
    REASON_TEMPLATES.rtoCount(rtoCount),
    REASON_TEMPLATES.successfulOrders(successfulOrders),
  ];
  const suggestedAction = REASON_TEMPLATES.suggestedAction(riskLevel);

  const summaryPrompt =
    riskLevel === "low"
      ? EXPLAINABILITY_PROMPTS.lowRiskSummary
      : riskLevel === "medium"
        ? EXPLAINABILITY_PROMPTS.mediumRiskSummary
        : EXPLAINABILITY_PROMPTS.highRiskSummary;

  return {
    level,
    riskLevel,
    reasons,
    suggestedAction,
    summaryPrompt,
  };
}
