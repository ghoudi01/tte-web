/**
 * IA pipeline: Data-driven growth experiment suggestions.
 * Aligns with RoadmapIdeas "تجارب نمو مدفوعة بالبيانات".
 * Uses datasets/market-benchmarks for RTO and success-rate comparison.
 */

import {
  MARKET_DEFAULT_RTO,
  MARKET_DEFAULT_SUCCESS_RATE,
  SEGMENT_BENCHMARKS,
} from "../datasets";

export type MerchantStats = {
  totalOrders: number;
  successfulOrders: number;
  rtoRate: number;
  successRate: number;
};

export type GrowthTip = {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
};

/** RTO threshold above market default to trigger high-priority tip */
const RTO_ABOVE_MARKET_THRESHOLD = 3;

export function getGrowthTips(stats: MerchantStats): GrowthTip[] {
  const tips: GrowthTip[] = [];
  const { totalOrders, successRate, rtoRate } = stats;
  const segment =
    totalOrders < 100
      ? SEGMENT_BENCHMARKS[0]
      : totalOrders < 500
        ? SEGMENT_BENCHMARKS[1]
        : SEGMENT_BENCHMARKS[2];
  const marketRto = segment?.avgRtoRate ?? MARKET_DEFAULT_RTO;
  const marketSuccess = segment?.avgSuccessRate ?? MARKET_DEFAULT_SUCCESS_RATE;

  if (totalOrders < 10) {
    tips.push({
      id: "more-orders",
      title: "زيادة عدد الطلبات المُتحقق منها",
      description:
        "استخدم التحقق المسبق للهاتف على الطلبات الجديدة لبناء سجل ثقة أسرع.",
      priority: "high",
    });
  }

  if (rtoRate > marketRto + RTO_ABOVE_MARKET_THRESHOLD) {
    tips.push({
      id: "lower-rto",
      title: "تقليل نسبة الارتجاع",
      description: `نسبة RTO لديك ${rtoRate}% مقابل متوسط السوق ~${marketRto}%. فعّل طلب عربون للطلبات ذات درجة ثقة أقل من 50% في الإعدادات.`,
      priority: "high",
    });
  }

  if (successRate < marketSuccess - 5 && totalOrders >= 5) {
    tips.push({
      id: "improve-success",
      title: "تحسين نسبة التسليم الناجح",
      description: `نسبة النجاح ${successRate}% أقل من متوسط السوق ~${marketSuccess}%. راجع الطلبات الفاشلة: استخدم توصية شركة الشحن التلقائية واتساب للتحقق قبل الشحن.`,
      priority: "medium",
    });
  }

  tips.push({
    id: "weekly-review",
    title: "مراجعة أسبوعية",
    description:
      "راجع لوحة التحكم كل أسبوع لمقارنة نسبة النجاح وRTO واتخاذ قرارات الشحن.",
    priority: "low",
  });

  return tips;
}
