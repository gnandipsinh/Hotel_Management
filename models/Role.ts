import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRole extends Document {
  hotelId?: Types.ObjectId;
  name: string;
  description?: string;
  permissionIds: Types.ObjectId[];
  isSystemRole: boolean;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>({
  hotelId: { type: Schema.Types.ObjectId, ref: "Hotel" },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 500 },
  permissionIds: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
  isSystemRole: { type: Boolean, default: false },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
}, {
  timestamps: true,
  strict: true,
});

RoleSchema.index({ hotelId: 1, name: 1 }, { unique: true });

export const Role = mongoose.models.Role || mongoose.model<IRole>("Role", RoleSchema);