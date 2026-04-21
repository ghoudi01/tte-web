const TUNISIA_PHONE_REGEX = /^(?:\+216|00216)?[2-9]\d{7}$/;

export function normalizePhoneInput(phone: string): string {
  return phone.replace(/[\s\-()]/g, "");
}

export function isValidTunisiaPhone(phone: string): boolean {
  return TUNISIA_PHONE_REGEX.test(normalizePhoneInput(phone));
}
