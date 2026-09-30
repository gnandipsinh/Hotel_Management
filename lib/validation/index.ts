/**
 * Centralized Validation Utilities
 *
 * Provides domain and format validators for emails, phone numbers,
 * Indian GSTIN, PAN, slugs, currency codes, and MongoDB ObjectIds.
 */

export {
  isValidObjectId,
  assertObjectId,
  escapeRegex,
  validateSlug,
  validateEmail,
  validatePhone,
  validateGSTIN,
  validatePAN,
  validateCurrency,
  slugify,
  SLUG_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  GSTIN_REGEX,
  PAN_REGEX,
  CURRENCY_REGEX,
} from "@/lib/db/validate";
