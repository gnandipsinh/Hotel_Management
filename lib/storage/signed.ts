/**
 * HMAC helpers behind the `getSignedUrl()` capability of the local adapter.
 *
 * A signed URL is a bearer credential: possession grants access until `exp`.
 * Production deployments use Cloudinary's signed delivery URLs; this scheme
 * keeps the local (dev/test) provider functionally equivalent so the whole
 * flow is testable without cloud credentials.
 */

import { createHmac, timingSafeEqual } from "crypto";

/**
 * Signing secret. `STORAGE_SIGNING_SECRET` should be set in production;
 * falls back to the Cloudinary secret when only that is configured.
 * The literal below is a *dev-only* placeholder, never a provider credential.
 */
export function getSigningSecret(): string {
  return (
    process.env.STORAGE_SIGNING_SECRET ||
    process.env.CLOUDINARY_API_SECRET ||
    "local-dev-storage-signing-secret"
  );
}

export function signStorageKey(key: string, expiresAtMs: number): string {
  return createHmac("sha256", getSigningSecret())
    .update(`${key}:${expiresAtMs}`)
    .digest("hex");
}

/** Constant-time verification of a signed key URL. Expired signatures fail. */
export function verifyStorageKeySignature(
  key: string,
  expiresAtMs: number,
  signature: string,
): boolean {
  if (!key || !signature) return false;
  if (!Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now()) return false;
  const expected = signStorageKey(key, expiresAtMs);
  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}
