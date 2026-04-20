/**
 * Credits-based payment model — see docs/CREDITS_PAYMENT_MODEL.md
 */

export const CREDITS = {
  /** Cost: first check of a phone number */
  CHECK_PHONE: 5,
  /** Cost: refresh / re-check same number */
  REFRESH_PHONE: 2,
  /** Earn: new report accepted */
  REPORT_ACCEPTED: 2,
  /** Earn: referred user completes first verification */
  REFERRAL_FIRST_CHECK: 3,
  /** Earn (optional): referred user signs up */
  REFERRAL_SIGNUP: 1,
  /** Free credits on signup */
  FREE_TRIAL: 10,
  /** Show low-balance warning below this */
  LOW_BALANCE_THRESHOLD: 10,
} as const;

export const CREDIT_PACKS = [
  {
    id: "starter",
    name: "البداية",
    credits: 50,
    priceTND: 9.99,
    perCredit: 0.2,
    bonusPercent: 10,
    description: "مثالي للبدء والتجربة",
    highlighted: false,
  },
  {
    id: "standard",
    name: "المعيار",
    credits: 150,
    priceTND: 24.99,
    perCredit: 0.17,
    bonusPercent: 0,
    description: "الأفضل للاستخدام المتوسط",
    highlighted: true,
  },
  {
    id: "growth",
    name: "النمو",
    credits: 400,
    priceTND: 59.99,
    perCredit: 0.15,
    bonusPercent: 15,
    description: "قيمة ممتازة للاستخدام المتكرر",
    highlighted: false,
  },
  {
    id: "business",
    name: "المؤسسات",
    credits: 1000,
    priceTND: 129.99,
    perCredit: 0.13,
    bonusPercent: 15,
    description: "أفضل سعر للمؤسسات والحجم الكبير",
    highlighted: false,
  },
] as const;

export type CreditTransactionType = "spend" | "earn";
export type CreditReason =
  | "check_phone"
  | "refresh_phone"
  | "report_accepted"
  | "referral_first_check"
  | "referral_signup"
  | "purchase"
  | "free_trial"
  | "bonus";

export const CREDIT_REASON_LABELS: Record<CreditReason, string> = {
  check_phone: "فحص رقم هاتف",
  refresh_phone: "إعادة فحص نفس الرقم",
  report_accepted: "تقرير مقبول",
  referral_first_check: "إحالة — أول تحقق للمُحال",
  referral_signup: "إحالة — تسجيل جديد",
  purchase: "شراء اعتمادات",
  free_trial: "اعتمادات ترحيبية",
  bonus: "مكافأة",
};
