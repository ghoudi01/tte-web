/**
 * Email validation utilities
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates if a string is a valid email format
 * @param email - The email string to validate
 * @returns boolean - true if valid email format
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Normalizes an email by trimming whitespace and converting to lowercase
 * @param email - The email to normalize
 * @returns string - Normalized email
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Email validation with detailed error messages
 */
export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateEmailDetailed(email: string): EmailValidationResult {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }

  const normalized = normalizeEmail(email);

  if (normalized.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }

  if (!EMAIL_REGEX.test(normalized)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
}
