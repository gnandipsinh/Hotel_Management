import { NextRequest } from "next/server";
import { ApiError, handleRouteError } from "@/lib/db/errors";
import { getFileBySignedKey } from "@/services/file/fileService";
import { serveAsset } from "@/services/file/contentService";
import { isSafeStorageKey } from "@/lib/storage/storage-path";

export const runtime = "nodejs";

/**
 * GET /api/files/content?key=…&exp=…&sig=… — signed storage-key access.
 *
 * This is the `getSignedUrl()` delivery path of the local provider: the HMAC
 * signature and expiry are verified in constant time before the key is even
 * looked up, so unsigned or tampered requests never reach storage.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const key = searchParams.get("key") || "";
    const exp = Number(searchParams.get("exp") || "0");
    const sig = searchParams.get("sig") || "";

    if (!isSafeStorageKey(key)) throw ApiError.badRequest("Invalid storage key");
    if (!sig) throw ApiError.forbidden("Access denied");

    const asset = await getFileBySignedKey(key, exp, sig);
    return await serveAsset(asset);
  } catch (err) {
    return handleRouteError(err);
  }
}
