/**
 * Merchant and company information validation utilities
 */

export interface MerchantValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates company name
 * @param name - Company name
 * @returns - Validation result
 */
export function validateCompanyName(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Company name is required' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Company name must be at least 2 characters' };
  }

  if (name.trim().length > 100) {
    return { isValid: false, error: 'Company name must be less than 100 characters' };
  }

  return { isValid: true };
}

/**
 * Validates company address
 * @param address - Company address
 * @returns - Validation result
 */
export function validateCompanyAddress(address: string): { isValid: boolean; error?: string } {
  if (!address || address.trim() === '') {
    return { isValid: false, error: 'Company address is required' };
  }

  if (address.trim().length < 5) {
    return { isValid: false, error: 'Company address must be at least 5 characters' };
  }

  if (address.trim().length > 200) {
    return { isValid: false, error: 'Company address must be less than 200 characters' };
  }

  return { isValid: true };
}

/**
 * Validates product types selection
 * @param productTypes - Array of selected product types
 * @returns - Validation result
 */
export function validateProductTypes(productTypes: string[]): { isValid: boolean; error?: string } {
  if (!productTypes || productTypes.length === 0) {
    return { isValid: false, error: 'Please select at least one product type' };
  }

  return { isValid: true };
}

/**
 * Validates full merchant registration data
 * @param data - Merchant registration data
 * @returns - Validation result with errors object
 */
export function validateMerchantData(data: {
  companyName: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  productTypes?: string[];
}): MerchantValidationResult {
  const errors: Record<string, string> = {};

  // Validate company name
  const nameValidation = validateCompanyName(data.companyName);
  if (!nameValidation.isValid && nameValidation.error) {
    errors.companyName = nameValidation.error;
  }

  // Validate company address (if provided)
  if (data.companyAddress) {
    const addressValidation = validateCompanyAddress(data.companyAddress);
    if (!addressValidation.isValid && addressValidation.error) {
      errors.companyAddress = addressValidation.error;
    }
  }

  // Validate company email if provided
  if (data.companyEmail && data.companyEmail.trim() !== '') {
    const { isValidEmail } = require('./email');
    if (!isValidEmail(data.companyEmail)) {
      errors.companyEmail = 'Company email must be valid';
    }
  }

  // Validate product types
  if (data.productTypes) {
    const productsValidation = validateProductTypes(data.productTypes);
    if (!productsValidation.isValid && productsValidation.error) {
      errors.productTypes = productsValidation.error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Common product categories for Tunisian e-commerce
 */
export const PRODUCT_CATEGORIES = [
  "إلكترونيات",
  "ملابس وأزياء",
  "أغذية ومشروبات",
  "أثاث ومنزل",
  "أدوات تجميل",
  "كتب ووسائل تعليمية",
  "ألعاب وترفيه",
  "رياضة ولياقة",
  "صحة وطب",
  "أخرى"
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

/**
 * Validates that a product category is valid
 * @param category - Category to validate
 * @returns - Whether the category is valid
 */
export function isValidProductCategory(category: string): category is ProductCategory {
  return PRODUCT_CATEGORIES.includes(category as ProductCategory);
}
