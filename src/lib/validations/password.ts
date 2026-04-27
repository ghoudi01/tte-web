/**
 * Password validation and strength calculation utilities
 */

export interface PasswordStrength {
  value: number; // 0-5 scale
  label: string
  // Multilingual support for strength labels
  english: ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong']
  arabic: ['ضعيف جداً', 'ضعيف', 'متوسط', 'قوي', 'قوي جداً']
  french: ['Très Faible', 'Faible', 'Moyen', 'Fort', 'Très Fort']
}

/**
 * Calculates password strength score from 0-5
 * Based on: length, uppercase/lowercase mix, numbers, special characters
 * @param password - Password to evaluate
 * @returns number - Strength score 0-5
 */
export function calculatePasswordStrength(password: string): number {
  if (!password) return 0;

  let strength = 0;

  // Length checks (2 points)
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;

  // Character variety (3 points)
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1; // Mixed case
  if (/\d/.test(password)) strength += 1; // Has numbers
  if (/[^a-zA-Z\d]/.test(password)) strength += 1; // Has special characters

  return strength;
}

/**
 * Gets the strength label in the specified language
 * @param strength - Strength score from 0-5
 * @param locale - Language locale ('en', 'ar', 'fr')
 * @returns string - Localized strength label
 */
export function getPasswordStrengthLabel(strength: number, locale: 'en' | 'ar' | 'fr' = 'ar'): string {
  const labels = {
    en: ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'],
    ar: ['ضعيف جداً', 'ضعيف', 'متوسط', 'قوي', 'قوي جداً'],
    fr: ['Très Faible', 'Faible', 'Moyen', 'Fort', 'Très Fort']
  };

  const labelArray = labels[locale];
  return labelArray[strength - 1] || labelArray[0];
}

/**
 * Gets the Tailwind CSS color class for the strength indicator
 * @param strength - Strength score from 0-5
 * @returns string - Tailwind color class
 */
export function getPasswordStrengthColor(strength: number): string {
  const colors = [
    'bg-red-500',    // Very Weak
    'bg-orange-500', // Weak
    'bg-yellow-500', // Medium
    'bg-blue-500',   // Strong
    'bg-green-600'   // Very Strong
  ];

  return colors[strength - 1] || colors[0];
}

/**
 * Gets the text color for the strength label
 * @param strength - Strength score from 0-5
 * @returns string - Tailwind text color class
 */
export function getPasswordStrengthTextColor(strength: number): string {
  const colors = [
    'text-red-500',      // Very Weak
    'text-orange-500',  // Weak
    'text-yellow-500',  // Medium
    'text-blue-500',    // Strong
    'text-green-600'    // Very Strong
  ];

  return colors[strength - 1] || colors[0];
}

/**
 * Validates password meets minimum requirements
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength?: number;
}

/**
 * Minimum password requirements:
 * - At least 6 characters
 * - May optionally have uppercase, lowercase, numbers, special chars
 */
export const MIN_PASSWORD_LENGTH = 6;

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (!password) {
    return {
      isValid: false,
      errors: ['Password is required']
    };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  // Check for common weak patterns
  if (/(.)\1{3,}/.test(password)) {
    errors.push('Password contains repeated characters');
  }

  const strength = calculatePasswordStrength(password);

  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
}

/**
 * Validates two passwords match
 * @param password - First password
 * @param confirmPassword - Second password to validate
 * @returns - Validation result with isValid and error message
 */
export function validatePasswordsMatch(password: string, confirmPassword: string): { isValid: boolean; error?: string } {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true };
}
