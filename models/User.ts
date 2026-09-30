import mongoose, { Document, Schema, Types } from "mongoose";
import { validateEmail, validatePhone } from "@/lib/db/validate";

export interface IUser extends Document {
  hotelId?: Types.ObjectId;
  branchIds: Types.ObjectId[];
  roleIds: Types.ObjectId[];
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: "active" | "inactive" | "invited" | "suspended";
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  hotelId: { type: Schema.Types.ObjectId, ref: "Hotel" },
  branchIds: [{ type: Schema.Types.ObjectId, ref: "Branch" }],
  roleIds: [{ type: Schema.Types.ObjectId, ref: "Role" }],
  name: { type: String, required: true, trim: true, maxlength: 200 },
  email: { type: String, required: true, lowercase: true, trim: true, validate: { validator: validateEmail, message: "Invalid email format" } },
  phone: { type: String, trim: true, validate: { validator: validatePhone, message: "Invalid phone format" } },
  avatar: { type: String, trim: true },
  status: { type: String, enum: ["active", "inactive", "invited", "suspended"], default: "invited" },
  lastLoginAt: { type: Date },
}, {
  timestamps: true,
  strict: true,
});

UserSchema.index({ hotelId: 1, email: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { hotelId: { $exists: false } } });

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);