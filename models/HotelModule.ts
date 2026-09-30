import mongoose, { Document, Schema, Types } from "mongoose";

export interface IHotelModule extends Document {
  hotelId: Types.ObjectId;
  moduleKey: string;
  enabled: boolean;
  enabledAt?: Date;
  configuration: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const HotelModuleSchema = new Schema<IHotelModule>({
  hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
  moduleKey: { type: String, required: true, trim: true, maxlength: 50 },
  enabled: { type: Boolean, default: true },
  enabledAt: { type: Date },
  configuration: { type: Schema.Types.Mixed, default: {} },
}, {
  timestamps: true,
  strict: true,
});

HotelModuleSchema.index({ hotelId: 1, moduleKey: 1 }, { unique: true });

export const HotelModule = mongoose.models.HotelModule || mongoose.model<IHotelModule>("HotelModule", HotelModuleSchema);