/**
 * Credits-based payment model — see docs/CREDITS_PAYMENT_MODEL.md
 */

export const CREDITS = {
  /** Cost: first check of a phone number */
  CHECK_PHONE: 5,
  /** Cost: refresh / re-check same number */
  REFRESH_PHONE: 2,
  /** Cost: auto-create report on order status change */
  REPORT_CREATE: 1,
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
    nameKey: "credits.packName.starter",
    descKey: "credits.packDesc.starter",
    credits: 50,
    priceTND: 9.99,
    bonusPercent: 10,
    highlighted: false,
  },
  {
    id: "standard",
    nameKey: "credits.packName.standard",
    descKey: "credits.packDesc.standard",
    credits: 150,
    priceTND: 24.99,
    bonusPercent: 0,
    highlighted: true,
  },
  {
    id: "growth",
    nameKey: "credits.packName.growth",
    descKey: "credits.packDesc.growth",
    credits: 400,
    priceTND: 59.99,
    bonusPercent: 15,
    highlighted: false,
  },
  {
    id: "business",
    nameKey: "credits.packName.business",
    descKey: "credits.packDesc.business",
    credits: 1000,
    priceTND: 129.99,
    bonusPercent: 15,
    highlighted: false,
  },
] as const;

export type CreditTransactionType = "spend" | "earn";
export type CreditReason =
  | "check_phone"
  | "refresh_phone"
  | "report_create"
  | "report_accepted"
  | "referral_first_check"
  | "referral_signup"
  | "purchase"
  | "free_trial"
  | "bonus";

export const CREDIT_REASON_LABELS: Record<CreditReason, string> = {
  check_phone: "credits.checkPhone",
  refresh_phone: "credits.refreshPhone",
  report_create: "credits.reportCreate",
  report_accepted: "credits.reportAccepted",
  referral_first_check: "credits.referralFirstCheck",
  referral_signup: "credits.referralSignup",
  purchase: "credits.purchase",
  free_trial: "credits.freeTrial",
  bonus: "credits.bonus",
};
