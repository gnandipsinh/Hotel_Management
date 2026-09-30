import mongoose, { Document, Schema } from "mongoose";

export interface IModule extends Document {
  key: string;
  name: string;
  description?: string;
  iconKey?: string;
  category: "administration" | "operations" | "finance" | "commercial";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema = new Schema<IModule>({
  key: { type: String, required: true, trim: true, lowercase: true, maxlength: 50 },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 500 },
  iconKey: { type: String, trim: true, maxlength: 50 },
  category: { type: String, enum: ["administration", "operations", "finance", "commercial"], default: "operations" },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
  strict: true,
});

ModuleSchema.index({ key: 1 }, { unique: true });

export const Module = mongoose.models.Module || mongoose.model<IModule>("Module", ModuleSchema);