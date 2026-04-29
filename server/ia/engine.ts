export type AutomationDecisionInput = {
  phoneNumber: string;
  amount: number;
  region?: string;
  trustThresholdForDeposit: number;
  autoShippingSelectionEnabled: boolean;
  defaultShippingCompany: string;
  shippingPartners: { name: string; focus: string; status: string }[];
};

export type AutomationDecision = {
  trustScore: number;
  riskLevel: "low" | "medium" | "high";
  requireDeposit: boolean;
  recommendedShippingCompany: string;
  decisionReasons: string[];
};

function scoreFromPhone(phoneNumber: string) {
  const digits = phoneNumber.replace(/\D/g, "");
  if (!digits) return 50;
  const sum = digits.split("").reduce((s, d) => s + Number(d), 0);
  return Math.max(15, Math.min(95, (sum * 7) % 101));
}

export function evaluateAutomationDecision(
  input: AutomationDecisionInput
): AutomationDecision {
  const trustScore = scoreFromPhone(input.phoneNumber);
  const riskLevel =
    trustScore >= 70 ? "low" : trustScore >= 40 ? "medium" : "high";
  const requireDeposit = trustScore < input.trustThresholdForDeposit;

  const available = input.shippingPartners.filter(
    p => p.status === "available"
  );
  const recommendedShippingCompany = input.autoShippingSelectionEnabled
    ? (available[0]?.name ?? input.defaultShippingCompany)
    : input.defaultShippingCompany;

  const decisionReasons = [
    `درجة الثقة الحالية ${trustScore}%`,
    requireDeposit
      ? "الطلب يحتاج عربون حسب إعداداتك"
      : "لا يحتاج عربون حسب إعداداتك",
    `شركة الشحن المقترحة: ${recommendedShippingCompany}`,
  ];

  return {
    trustScore,
    riskLevel,
    requireDeposit,
    recommendedShippingCompany,
    decisionReasons,
  };
}
