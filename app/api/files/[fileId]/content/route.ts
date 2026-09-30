import { NextRequest } from "next/server";
import { handleRouteError } from "@/lib/db/errors";
import { getFileForAccess } from "@/services/file/fileService";
import { serveAsset } from "@/services/file/contentService";

export const runtime = "nodejs";

/**
 * GET /api/files/:fileId/content?t=… — file bytes.
 *
 * Public assets resolve for anyone holding the id. Private assets (documents,
 * payment proofs) require the per-file access token issued at upload time;
 * without it the request is rejected — private content is never public.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  try {
    const { fileId } = await params;
    const token = new URL(request.url).searchParams.get("t") || undefined;
    const asset = await getFileForAccess(fileId, token);
    return await serveAsset(asset);
  } catch (err) {
    return handleRouteError(err);
  }
}
