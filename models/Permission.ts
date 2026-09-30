import mongoose, { Document, Schema } from "mongoose";

export interface IPermission extends Document {
  key: string;
  module: string;
  action: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema = new Schema<IPermission>({
  key: { type: String, required: true, trim: true, maxlength: 100 },
  module: { type: String, required: true, trim: true, maxlength: 50 },
  action: { type: String, required: true, trim: true, maxlength: 50 },
  description: { type: String, trim: true, maxlength: 500 },
}, {
  timestamps: true,
  strict: true,
});

PermissionSchema.index({ key: 1 }, { unique: true });
PermissionSchema.index({ module: 1 });

export const Permission = mongoose.models.Permission || mongoose.model<IPermission>("Permission", PermissionSchema);