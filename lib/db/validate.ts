import { Types } from "mongoose";
import { ApiError } from "@/lib/db/errors";

export function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}

export function assertObjectId(id: string, field = "id"): void {
  if (!isValidObjectId(id)) {
    throw ApiError.badRequest(`Invalid ${field}`);
  }
}

export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^\+?[0-9\s\-()]{7,15}$/;
export const GSTIN_REGEX = /^[0-9A-Z]{15}$/;
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const CURRENCY_REGEX = /^[A-Z]{3}$/;

export function validateSlug(slug: string): boolean {
  return SLUG_REGEX.test(slug);
}

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validatePhone(phone: string): boolean {
  return PHONE_REGEX.test(phone);
}

export function validateGSTIN(gstin: string): boolean {
  return GSTIN_REGEX.test(gstin);
}

export function validatePAN(pan: string): boolean {
  return PAN_REGEX.test(pan);
}

export function validateCurrency(currency: string): boolean {
  return CURRENCY_REGEX.test(currency);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}