import { NextRequest } from "next/server";
import { parsePagination } from "@/lib/db/pagination";
import { ApiError, handleRouteError, jsonOk } from "@/lib/db/errors";
import { createFileAsset, listFiles, type FileAssetDto } from "@/services/file/fileService";
import { MAX_UPLOAD_SIZE_BYTES } from "@/lib/storage/file-categories";

export const runtime = "nodejs";

/**
 * POST /api/files — multipart upload.
 * Validates request → file bytes → category → entity → tenant, then uploads
 * to storage and persists FileAsset metadata.
 */
export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > MAX_UPLOAD_SIZE_BYTES + 64 * 1024) {
      throw ApiError.badRequest("File is too large");
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      throw ApiError.badRequest('A file is required in the "file" field');
    }
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      throw ApiError.badRequest("File is too large");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await createFileAsset({
      hotelId: String(form.get("hotelId") ?? ""),
      category: String(form.get("category") ?? ""),
      branchId: String(form.get("branchId") ?? "") || undefined,
      entityType: String(form.get("entityType") ?? "") || undefined,
      entityId: String(form.get("entityId") ?? "") || undefined,
      replaceFileId: String(form.get("replaceFileId") ?? "") || undefined,
      file: {
        buffer,
        fileName: file.name,
        declaredMimeType: file.type,
      },
    });

    return jsonOk<FileAssetDto>(asset, undefined, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}

/**
 * GET /api/files?hotelId=… — paginated metadata listing with optional
 * category / entity filters.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const hotelId = searchParams.get("hotelId");
    if (!hotelId) throw ApiError.badRequest("hotelId is required");

    const params = parsePagination(searchParams, {
      allowedSort: ["createdAt", "size", "originalName", "category", "sortOrder"],
    });

    // Gallery ordering lives in metadata; translate the public sort key.
    const sortField = Object.keys(params.sort)[0];
    const sort: Record<string, 1 | -1> =
      sortField === "sortOrder" ? { "metadata.sortOrder": params.sort[sortField] } : params.sort;

    const result = await listFiles({
      hotelId,
      page: params.page,
      limit: params.limit,
      sort,
      search: params.search,
      category: searchParams.get("category") || undefined,
      entityType: searchParams.get("entityType") || undefined,
      entityId: searchParams.get("entityId") || undefined,
      includeDeleted: searchParams.get("includeDeleted") === "true",
    });

    return jsonOk(result.items, result.meta);
  } catch (err) {
    return handleRouteError(err);
  }
}
