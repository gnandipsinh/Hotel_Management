import mongoose, { Document, Schema, Types } from "mongoose";
import { validatePhone, validateEmail } from "@/lib/db/validate";

export interface IBranch extends Document {
  hotelId: Types.ObjectId;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  timezone: string;
  status: "active" | "inactive";
  settings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema = new Schema<IBranch>({
  hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
  name: { type: String, required: true, trim: true, maxlength: 200 },
  code: { type: String, required: true, uppercase: true, trim: true, maxlength: 20 },
  email: { type: String, lowercase: true, trim: true, validate: { validator: validateEmail, message: "Invalid email format" } },
  phone: { type: String, trim: true, validate: { validator: validatePhone, message: "Invalid phone format" } },
  address: { type: String, required: true, trim: true, maxlength: 500 },
  city: { type: String, required: true, trim: true, maxlength: 100 },
  state: { type: String, required: true, trim: true, maxlength: 100 },
  country: { type: String, required: true, trim: true, maxlength: 100, default: "India" },
  pincode: { type: String, required: true, trim: true, maxlength: 20 },
  timezone: { type: String, required: true, trim: true, default: "Asia/Kolkata" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  settings: { type: Schema.Types.Mixed, default: {} },
}, {
  timestamps: true,
  strict: true,
});

BranchSchema.index({ hotelId: 1 });
BranchSchema.index({ hotelId: 1, code: 1 }, { unique: true });

export function validateBranchCode(code: string): boolean {
  return /^[A-Z0-9]{2,20}$/.test(code);
}

export const Branch = mongoose.models.Branch || mongoose.model<IBranch>("Branch", BranchSchema);