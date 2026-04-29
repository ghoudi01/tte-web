export type MerchantAutomationConfig = {
  autoValidationEnabled: boolean;
  whatsappValidationEnabled: boolean;
  autoShippingSelectionEnabled: boolean;
  trustThresholdForDeposit: number;
  defaultShippingCompany: string;
};

const defaults: MerchantAutomationConfig = {
  autoValidationEnabled: true,
  whatsappValidationEnabled: true,
  autoShippingSelectionEnabled: true,
  trustThresholdForDeposit: 40,
  defaultShippingCompany: "Rapid-Poste",
};

const store = new Map<number, MerchantAutomationConfig>();

export function getMerchantAutomationConfig(
  userId: number
): MerchantAutomationConfig {
  return store.get(userId) ?? defaults;
}

export function updateMerchantAutomationConfig(
  userId: number,
  patch: Partial<MerchantAutomationConfig>
): MerchantAutomationConfig {
  const current = getMerchantAutomationConfig(userId);
  const next = { ...current, ...patch };
  store.set(userId, next);
  return next;
}
