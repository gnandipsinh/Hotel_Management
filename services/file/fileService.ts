/**
 * FileAsset service — upload orchestration, metadata queries, safe deletion.
 *
 * Guarantees:
 * - Binary bytes only ever touch storage; MongoDB stores metadata + reference.
 * - Every operation is tenant-scoped (`hotelId`), verified against the Hotel
 *   and Branch collections. Hotel A can never read or mutate Hotel B files.
 * - Storage keys are built server-side from validated ObjectIds — clients only
 *   ever supply ids and a category, never a path.
 * - Partial-failure compensation: storage uploaded but DB save failed → the
 *   storage object is removed; DB saved but storage failed → no record exists.
 */

import { createHash, randomBytes } from "crypto";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db/mongoose";
import { FileAsset, type IFileAsset, type FileAssetStatus } from "@/models/FileAsset";
import { Hotel } from "@/models/Hotel";
import { Branch } from "@/models/Branch";
import { ApiError, normalizeDbError } from "@/lib/db/errors";
import { buildMeta } from "@/lib/db/pagination";
import {
  getCategoryConfig,
  type CategoryConfig,
  type FileCategory,
} from "@/lib/storage/file-categories";
import { buildStorageKey } from "@/lib/storage/storage-path";
import { validateFile } from "@/lib/storage/validate";
import { deleteFile, getStorageProvider, uploadFile } from "@/lib/storage/provider";
import { verifyStorageKeySignature } from "@/lib/storage/signed";

export interface FileAssetDto {
  id: string;
  hotelId: string;
  branchId?: string;
  originalName: string;
  storageProvider: string;
  url: string;
  secureUrl?: string;
  mimeType: string;
  extension: string;
  size: number;
  category: FileCategory;
  entityType?: string;
  entityId?: string;
  width?: number;
  height?: number;
  status: FileAssetStatus;
  access: "public" | "private";
  sortOrder: number;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AssetMetadata {
  checksum?: string;
  accessToken?: string;
  sortOrder?: number;
  isPrimary?: boolean;
  access?: "public" | "private";
}

function metadata(doc: IFileAsset): AssetMetadata {
  return (doc.metadata ?? {}) as AssetMetadata;
}

/** Strip every internal field (storage key, access token, checksum). */
export function toFileAssetDto(doc: IFileAsset): FileAssetDto {
  const meta = metadata(doc);
  return {
    id: doc._id.toString(),
    hotelId: doc.hotelId.toString(),
    branchId: doc.branchId?.toString(),
    originalName: doc.originalName,
    storageProvider: doc.storageProvider,
    url: doc.url,
    secureUrl: doc.secureUrl,
    mimeType: doc.mimeType,
    extension: doc.extension,
    size: doc.size,
    category: doc.category,
    entityType: doc.entityType,
    entityId: doc.entityId?.toString(),
    width: doc.width,
    height: doc.height,
    status: doc.status,
    access: meta.access ?? "public",
    sortOrder: meta.sortOrder ?? 0,
    isPrimary: meta.isPrimary ?? false,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function assertValidId(value: string | undefined, field: string): string | undefined {
  if (value === undefined || value === "") return undefined;
  if (!Types.ObjectId.isValid(value)) throw ApiError.badRequest(`Invalid ${field}`);
  return value;
}

async function requireHotel(hotelId: string) {
  if (!Types.ObjectId.isValid(hotelId)) throw ApiError.badRequest("Invalid hotelId");
  const hotel = await Hotel.findById(hotelId).lean().exec();
  if (!hotel) throw ApiError.notFound("Hotel not found");
  return hotel;
}

/** Verify the branch exists AND belongs to this hotel (cross-tenant → 404). */
async function requireBranch(branchId: string, hotelId: string) {
  if (!Types.ObjectId.isValid(branchId)) throw ApiError.badRequest("Invalid branchId");
  const branch = await Branch.findOne({ _id: branchId, hotelId }).lean().exec();
  if (!branch) throw ApiError.notFound("Branch not found");
  return branch;
}

function requireCategory(category: string): { config: CategoryConfig; category: FileCategory } {
  const config = getCategoryConfig(category);
  if (!config) {
    throw ApiError.badRequest("Unsupported file category", {
      category: ["Unsupported file category"],
    });
  }
  return { config, category: category as FileCategory };
}

export interface CreateFileAssetInput {
  hotelId: string;
  category: string;
  branchId?: string;
  entityType?: string;
  entityId?: string;
  replaceFileId?: string;
  file: {
    buffer: Buffer;
    fileName: string;
    declaredMimeType?: string;
  };
}

function sha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

async function softDeleteAsset(asset: IFileAsset): Promise<void> {
  asset.status = "deleted";
  try {
    await asset.save();
  } catch {
    // The storage object is removed regardless; a stale active row pointing at
    // a missing object is handled gracefully by the content route.
  }
  try {
    await deleteFile(asset.storageKey);
  } catch {
    // Best effort — never fail the primary operation because of cleanup.
  }
}

export async function createFileAsset(input: CreateFileAssetInput): Promise<FileAssetDto> {
  await connectDB();

  const { config, category } = requireCategory(input.category);
  await requireHotel(input.hotelId);

  // ---- entity relationship ------------------------------------------------
  const branchId = assertValidId(input.branchId, "branchId");
  const entityId = assertValidId(input.entityId, "entityId");

  if (config.entity === "branch" || config.entity === "room") {
    if (!branchId) throw ApiError.badRequest("branchId is required for this category");
    await requireBranch(branchId, input.hotelId);
  } else if (branchId) {
    await requireBranch(branchId, input.hotelId);
  }

  if (config.entity === "room" && !entityId) {
    throw ApiError.badRequest("entityId (room id) is required for this category");
  }
  if (config.entity !== "room" && entityId && !Types.ObjectId.isValid(entityId)) {
    throw ApiError.badRequest("Invalid entityId");
  }

  const entityType = input.entityType || (config.entity === "room" ? "room" : config.entity === "branch" ? "branch" : "hotel");

  // ---- file validation (bytes, extension, size, MIME) ---------------------
  const validated = validateFile({
    buffer: input.file.buffer,
    fileName: input.file.fileName,
    declaredMimeType: input.file.declaredMimeType,
    category,
  });
  const checksum = sha256(input.file.buffer);

  // ---- replacement target -------------------------------------------------
  let replaceTarget: IFileAsset | null = null;
  if (input.replaceFileId) {
    const replaceId = assertValidId(input.replaceFileId, "replaceFileId");
    if (replaceId) {
      replaceTarget = (await FileAsset.findOne({
        _id: replaceId,
        hotelId: input.hotelId,
        status: "active",
      })
        .lean()
        .exec()) as unknown as IFileAsset | null;
      if (!replaceTarget) throw ApiError.notFound("File to replace not found");
      if (replaceTarget.category !== category) {
        throw ApiError.badRequest("replaceFileId belongs to a different category");
      }
    }
  }

  // ---- duplicate prevention (same tenant + entity + exact content) --------
  const entityFilter: Record<string, unknown> = {};
  if (entityId) entityFilter.entityId = entityId;
  else if (config.entity !== "room") entityFilter.entityId = { $exists: false };
  if (branchId) entityFilter.branchId = branchId;

  const duplicate = await FileAsset.findOne({
    hotelId: input.hotelId,
    category,
    status: "active",
    "metadata.checksum": checksum,
    ...entityFilter,
  })
    .lean()
    .exec();

  if (duplicate) {
    const duplicateId = duplicate._id.toString();
    if (replaceTarget && replaceTarget._id.toString() !== duplicateId) {
      const full = await FileAsset.findById(replaceTarget._id).exec();
      if (full) await softDeleteAsset(full);
    }
    const doc = await FileAsset.findById(duplicateId).exec();
    if (!doc) throw ApiError.notFound("File not found");
    return toFileAssetDto(doc);
  }

  // ---- storage key (server-constructed, tenant-aware) ---------------------
  const storage = buildStorageKey({
    hotelId: input.hotelId,
    category,
    branchId,
    entityId,
    originalName: validated.originalName,
  });

  const provider = getStorageProvider();
  const accessToken = config.access === "private" ? randomBytes(16).toString("hex") : undefined;

  const asset = new FileAsset({
    hotelId: input.hotelId,
    branchId,
    uploadedBy: null,
    originalName: validated.originalName,
    fileName: storage.fileName,
    storageProvider: provider.name,
    storageKey: storage.key,
    url: "",
    secureUrl: "",
    mimeType: validated.mimeType,
    extension: validated.extension,
    size: validated.size,
    category,
    entityType,
    entityId,
    width: validated.width,
    height: validated.height,
    status: "uploading",
    metadata: {
      checksum,
      access: config.access,
      sortOrder: 0,
      isPrimary: false,
      ...(accessToken && { accessToken }),
    },
  });

  // ---- 6. upload to storage (no DB record exists yet) ---------------------
  let uploadedKey = storage.key;
  try {
    const uploaded = await uploadFile(
      { buffer: input.file.buffer, fileName: storage.fileName, mimeType: validated.mimeType },
      { key: storage.key, access: config.access },
    );
    // The provider may namespace keys (e.g. Cloudinary adds its own folder).
    uploadedKey = uploaded.key;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw ApiError.internal("File storage is unavailable right now. Please try again.");
  }
  asset.storageKey = uploadedKey;

  // ---- 7. save metadata; compensate if the save fails ---------------------
  // Delivery always resolves through the id-based content route, which streams
  // local bytes or redirects to the provider (with a signed URL when private).
  const contentPath = `/api/files/${asset._id.toString()}/content`;
  asset.url =
    config.access === "private" ? `${contentPath}?t=${accessToken}` : contentPath;
  asset.secureUrl = asset.url;
  asset.status = "active";

  try {
    await asset.save();
  } catch (err) {
    try {
      await deleteFile(uploadedKey);
    } catch {
      // orphan cleanup is best effort; never surface storage internals
    }
    throw normalizeDbError(err);
  }

  // ---- replacement cleanup ------------------------------------------------
  if (replaceTarget && replaceTarget._id.toString() !== asset._id.toString()) {
    const full = await FileAsset.findById(replaceTarget._id).exec();
    if (full) await softDeleteAsset(full);
  } else if (config.single) {
    const previous = await FileAsset.find({
      hotelId: input.hotelId,
      category,
      status: "active",
      _id: { $ne: asset._id },
    }).exec();
    for (const old of previous) {
      await softDeleteAsset(old);
    }
  }

  return toFileAssetDto(asset);
}

export interface ListFilesParams {
  hotelId: string;
  page: number;
  limit: number;
  sort: Record<string, 1 | -1>;
  search: string;
  category?: string;
  entityType?: string;
  entityId?: string;
  includeDeleted?: boolean;
}

export async function listFiles(params: ListFilesParams) {
  await connectDB();
  await requireHotel(params.hotelId);

  const { page, sort, search } = params;
  const limit = Math.min(100, Math.max(1, params.limit));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = { hotelId: params.hotelId };
  if (!params.includeDeleted) filter.status = "active";
  if (params.category) {
    requireCategory(params.category);
    filter.category = params.category;
  }
  if (params.entityType) filter.entityType = params.entityType;
  if (params.entityId) {
    assertValidId(params.entityId, "entityId");
    filter.entityId = params.entityId;
  }
  if (search) {
    filter.originalName = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
  }

  const [items, total] = await Promise.all([
    FileAsset.find(filter).sort(sort).skip(skip).limit(limit).lean().exec(),
    FileAsset.countDocuments(filter),
  ]);

  return {
    items: (items as unknown as IFileAsset[]).map((doc) => toFileAssetDto(doc)),
    meta: buildMeta(total, page, limit),
  };
}

async function requireOwnedAsset(fileId: string, hotelId: string): Promise<IFileAsset> {
  if (!Types.ObjectId.isValid(fileId)) throw ApiError.badRequest("Invalid fileId");
  if (!Types.ObjectId.isValid(hotelId)) throw ApiError.badRequest("Invalid hotelId");
  const asset = await FileAsset.findById(fileId).exec();
  // Never reveal whether the file exists under another hotel.
  if (!asset || asset.status === "deleted" || asset.hotelId.toString() !== hotelId) {
    throw ApiError.notFound("File not found");
  }
  return asset;
}

export async function getFileAsset(fileId: string, hotelId: string): Promise<FileAssetDto> {
  await connectDB();
  return toFileAssetDto(await requireOwnedAsset(fileId, hotelId));
}

export interface PatchFileAssetInput {
  sortOrder?: number;
  isPrimary?: boolean;
}

export async function patchFileAsset(
  fileId: string,
  hotelId: string,
  patch: PatchFileAssetInput,
): Promise<FileAssetDto> {
  await connectDB();
  const asset = await requireOwnedAsset(fileId, hotelId);

  if (patch.sortOrder !== undefined) {
    if (!Number.isFinite(patch.sortOrder)) throw ApiError.badRequest("Invalid sortOrder");
    asset.metadata = { ...metadata(asset), sortOrder: Math.trunc(patch.sortOrder) };
  }

  if (patch.isPrimary !== undefined) {
    if (typeof patch.isPrimary !== "boolean") throw ApiError.badRequest("Invalid isPrimary");
    asset.metadata = { ...metadata(asset), isPrimary: patch.isPrimary };

    if (patch.isPrimary) {
      const entityFilter: Record<string, unknown> = {
        hotelId: asset.hotelId,
        category: asset.category,
        status: "active",
        _id: { $ne: asset._id },
      };
      if (asset.entityId) entityFilter.entityId = asset.entityId;
      if (asset.branchId) entityFilter.branchId = asset.branchId;

      await FileAsset.updateMany(entityFilter, { $set: { "metadata.isPrimary": false } });
    }
  }

  try {
    await asset.save();
  } catch (err) {
    throw normalizeDbError(err);
  }
  return toFileAssetDto(asset);
}

export async function deleteFileAsset(fileId: string, hotelId: string): Promise<FileAssetDto> {
  await connectDB();
  const asset = await requireOwnedAsset(fileId, hotelId);

  // 1. remove the storage object (missing object is tolerated)
  try {
    await deleteFile(asset.storageKey);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw ApiError.internal("Could not delete the file from storage. Please try again.");
  }

  // 2. mark metadata deleted
  asset.status = "deleted";
  try {
    await asset.save();
  } catch (err) {
    throw normalizeDbError(err);
  }

  return toFileAssetDto(asset);
}

/**
 * Resolve a file for content delivery.
 * Private categories require the per-file access token (bearer credential).
 */
export async function getFileForAccess(fileId: string, token?: string): Promise<IFileAsset> {
  await connectDB();
  if (!Types.ObjectId.isValid(fileId)) throw ApiError.badRequest("Invalid fileId");
  const asset = await FileAsset.findById(fileId).exec();
  if (!asset || asset.status !== "active") throw ApiError.notFound("File not found");

  const meta = metadata(asset);
  if ((meta.access ?? "public") === "private" && meta.accessToken !== token) {
    throw ApiError.forbidden("Access denied");
  }
  return asset;
}

/**
 * Resolve a file through a signed storage-key URL (local provider capability).
 * Signature + expiry are verified before the key is even looked up.
 */
export async function getFileBySignedKey(
  key: string,
  expiresAt: number,
  signature: string,
): Promise<IFileAsset> {
  await connectDB();
  if (!verifyStorageKeySignature(key, expiresAt, signature)) {
    throw ApiError.forbidden("Access denied");
  }
  const asset = await FileAsset.findOne({ storageKey: key, status: "active" }).exec();
  if (!asset) throw ApiError.notFound("File not found");
  return asset;
}
