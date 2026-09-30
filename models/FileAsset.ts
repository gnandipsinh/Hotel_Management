import mongoose, { Document, Schema, Types } from "mongoose";
import { FILE_CATEGORIES, type FileCategory } from "@/lib/storage/file-categories";

export type FileAssetStatus = "uploading" | "active" | "deleted" | "failed";
export type StorageProviderField = "cloudinary" | "local";

/**
 * FileAsset — metadata + storage reference for every uploaded file.
 * Binary content NEVER lives in MongoDB; only the reference does.
 */
export interface IFileAsset extends Document {
  hotelId: Types.ObjectId;
  branchId?: Types.ObjectId;
  uploadedBy?: Types.ObjectId | null;
  originalName: string;
  fileName: string;
  storageProvider: StorageProviderField;
  storageKey: string;
  url: string;
  secureUrl?: string;
  mimeType: string;
  extension: string;
  size: number;
  category: FileCategory;
  entityType?: string;
  entityId?: Types.ObjectId;
  width?: number;
  height?: number;
  status: FileAssetStatus;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const FileAssetSchema = new Schema<IFileAsset>(
  {
    hotelId: { type: Schema.Types.ObjectId, required: true, ref: "Hotel" },
    branchId: { type: Schema.Types.ObjectId, ref: "Branch" },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    originalName: { type: String, required: true, trim: true, maxlength: 255 },
    fileName: { type: String, required: true, trim: true, maxlength: 255 },
    storageProvider: { type: String, required: true, enum: ["cloudinary", "local"] },
    storageKey: { type: String, required: true, trim: true, maxlength: 512 },
    url: { type: String, required: true, trim: true, maxlength: 1024 },
    secureUrl: { type: String, trim: true, maxlength: 1024 },
    mimeType: { type: String, required: true, trim: true, maxlength: 100 },
    extension: { type: String, required: true, trim: true, maxlength: 10 },
    size: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, enum: FILE_CATEGORIES },
    entityType: { type: String, trim: true, maxlength: 50 },
    entityId: { type: Schema.Types.ObjectId },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
    status: {
      type: String,
      required: true,
      enum: ["uploading", "active", "deleted", "failed"],
      default: "uploading",
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
    strict: true,
  },
);

FileAssetSchema.index({ hotelId: 1 });
FileAssetSchema.index({ hotelId: 1, category: 1 });
FileAssetSchema.index({ hotelId: 1, entityType: 1, entityId: 1 });
FileAssetSchema.index({ createdAt: -1 });

export const FileAsset: mongoose.Model<IFileAsset> =
  (mongoose.models.FileAsset as mongoose.Model<IFileAsset>) ||
  mongoose.model<IFileAsset>("FileAsset", FileAssetSchema);
