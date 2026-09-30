import { NextRequest } from "next/server";
import { ApiError, handleRouteError, jsonOk } from "@/lib/db/errors";
import { deleteFileAsset, getFileAsset, patchFileAsset } from "@/services/file/fileService";

export const runtime = "nodejs";

/**
 * GET /api/files/:fileId?hotelId=… — file metadata (tenant-scoped).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  try {
    const { fileId } = await params;
    const hotelId = new URL(request.url).searchParams.get("hotelId");
    if (!hotelId) throw ApiError.badRequest("hotelId is required");
    const asset = await getFileAsset(fileId, hotelId);
    return jsonOk(asset);
  } catch (err) {
    return handleRouteError(err);
  }
}

/**
 * PATCH /api/files/:fileId?hotelId=… — reorder (`sortOrder`) / primary flag.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  try {
    const { fileId } = await params;
    const hotelId = new URL(request.url).searchParams.get("hotelId");
    if (!hotelId) throw ApiError.badRequest("hotelId is required");

    const body = await request.json();
    if (body === null || typeof body !== "object") {
      throw ApiError.badRequest("Invalid request body");
    }
    const patch: { sortOrder?: number; isPrimary?: boolean } = {};
    if (body.sortOrder !== undefined) patch.sortOrder = Number(body.sortOrder);
    if (body.isPrimary !== undefined) patch.isPrimary = body.isPrimary === true;
    if (patch.sortOrder === undefined && patch.isPrimary === undefined) {
      throw ApiError.badRequest("Nothing to update");
    }

    const asset = await patchFileAsset(fileId, hotelId, patch);
    return jsonOk(asset);
  } catch (err) {
    return handleRouteError(err);
  }
}

/**
 * DELETE /api/files/:fileId?hotelId=… — ownership-checked deletion.
 * Removes the storage object, then soft-deletes the metadata.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  try {
    const { fileId } = await params;
    const hotelId = new URL(request.url).searchParams.get("hotelId");
    if (!hotelId) throw ApiError.badRequest("hotelId is required");
    const asset = await deleteFileAsset(fileId, hotelId);
    return jsonOk(asset);
  } catch (err) {
    return handleRouteError(err);
  }
}
