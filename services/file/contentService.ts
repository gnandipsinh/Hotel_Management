/**
 * Content delivery for FileAssets.
 *
 * - local provider    → bytes are streamed from disk
 * - cloudinary        → 302 redirect to a public (or signed, when private) URL
 *
 * Access control is performed by `fileService` before this helper is called.
 */

import { NextResponse } from "next/server";
import type { IFileAsset } from "@/models/FileAsset";
import { ApiError } from "@/lib/db/errors";
import { getFile, getPublicUrl, getSignedUrl } from "@/lib/storage/provider";

function isPrivateAsset(asset: IFileAsset): boolean {
  return ((asset.metadata as Record<string, unknown> | undefined)?.access ?? "public") === "private";
}

export async function serveAsset(asset: IFileAsset): Promise<NextResponse> {
  const provider = (asset.storageProvider || "local") as "local" | "cloudinary";

  if (provider === "local") {
    const file = await getFile(asset.storageKey);
    if (!file) throw ApiError.notFound("File content is unavailable");
    return new NextResponse(new Uint8Array(file.buffer), {
      status: 200,
      headers: {
        "Content-Type": asset.mimeType,
        "Content-Length": String(file.buffer.length),
        "Content-Disposition": `inline; filename="${encodeURIComponent(asset.originalName)}"`,
        "Cache-Control": isPrivateAsset(asset)
          ? "private, max-age=3600"
          : "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  const url = isPrivateAsset(asset) ? await getSignedUrl(asset.storageKey) : getPublicUrl(asset.storageKey);
  return NextResponse.redirect(url, { status: 302 });
}
