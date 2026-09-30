import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAuditLog extends Document {
  hotelId?: Types.ObjectId;
  branchId?: Types.ObjectId;
  userId?: Types.ObjectId;
  action: string;
  entity: string;
  entityId?: Types.ObjectId;
  metadata: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  hotelId: { type: Schema.Types.ObjectId, ref: "Hotel" },
  branchId: { type: Schema.Types.ObjectId, ref: "Branch" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true, trim: true, maxlength: 50 },
  entity: { type: String, required: true, trim: true, maxlength: 50 },
  entityId: { type: Schema.Types.ObjectId },
  metadata: { type: Schema.Types.Mixed, default: {} },
  ipAddress: { type: String, trim: true },
  userAgent: { type: String, trim: true },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  strict: true,
});

AuditLogSchema.index({ hotelId: 1, createdAt: -1 });
AuditLogSchema.index({ branchId: 1, createdAt: -1 });
AuditLogSchema.index({ userId: 1, createdAt: -1 });

export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);