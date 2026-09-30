import mongoose, { Document, Schema } from "mongoose";
import { validateSlug, validateEmail, validatePhone, validateGSTIN, validatePAN, validateCurrency, slugify } from "@/lib/db/validate";

export interface IGstDetails {
  gstin?: string;
  pan?: string;
  registrationNumber?: string;
  taxRegistered?: boolean;
}

export interface ISubscription {
  planKey?: string;
  status?: "trial" | "active" | "suspended" | "expired";
  startedAt?: Date;
  renewsAt?: Date;
}

export interface ISettings {
  [key: string]: unknown;
}

export interface IHotel extends Document {
  name: string;
  legalName?: string;
  slug: string;
  email: string;
  phone?: string;
  alternatePhone?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  logo?: string;
  coverImage?: string;
  timezone: string;
  currency: string;
  locale: string;
  gstDetails?: IGstDetails;
  status: "pending" | "active" | "inactive" | "suspended";
  subscription?: ISubscription;
  settings?: ISettings;
  createdAt: Date;
  updatedAt: Date;
}

const GstDetailsSchema = new Schema<IGstDetails>({
  gstin: { type: String, trim: true, validate: { validator: validateGSTIN, message: "Invalid GSTIN format" } },
  pan: { type: String, trim: true, validate: { validator: validatePAN, message: "Invalid PAN format" } },
  registrationNumber: { type: String, trim: true },
  taxRegistered: { type: Boolean, default: false },
}, { _id: false });

const SubscriptionSchema = new Schema<ISubscription>({
  planKey: { type: String, trim: true },
  status: { type: String, enum: ["trial", "active", "suspended", "expired"] },
  startedAt: { type: Date },
  renewsAt: { type: Date },
}, { _id: false });

const HotelSchema = new Schema<IHotel>({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  legalName: { type: String, trim: true, maxlength: 200 },
  slug: { type: String, required: true, lowercase: true, trim: true, maxlength: 100, validate: { validator: validateSlug, message: "Invalid slug format" } },
  email: { type: String, required: true, lowercase: true, trim: true, validate: { validator: validateEmail, message: "Invalid email format" } },
  phone: { type: String, trim: true, validate: { validator: validatePhone, message: "Invalid phone format" } },
  alternatePhone: { type: String, trim: true, validate: { validator: validatePhone, message: "Invalid phone format" } },
  address: { type: String, required: true, trim: true, maxlength: 500 },
  city: { type: String, required: true, trim: true, maxlength: 100 },
  state: { type: String, required: true, trim: true, maxlength: 100 },
  country: { type: String, required: true, trim: true, maxlength: 100 },
  pincode: { type: String, required: true, trim: true, maxlength: 20 },
  logo: { type: String, trim: true },
  coverImage: { type: String, trim: true },
  timezone: { type: String, required: true, trim: true, default: "Asia/Kolkata" },
  currency: { type: String, required: true, trim: true, uppercase: true, validate: { validator: validateCurrency, message: "Currency must be a 3-letter ISO 4217 code" }, default: "INR" },
  locale: { type: String, required: true, trim: true, default: "en-IN" },
  gstDetails: { type: GstDetailsSchema, default: {} },
  status: { type: String, enum: ["pending", "active", "inactive", "suspended"], default: "pending" },
  subscription: { type: SubscriptionSchema, default: {} },
  settings: { type: Schema.Types.Mixed, default: {} },
}, {
  timestamps: true,
  strict: true,
});

HotelSchema.index({ slug: 1 }, { unique: true });
HotelSchema.index({ status: 1 });
HotelSchema.index({ email: 1 });

HotelSchema.pre("validate", function (next) {
  if (this.isNew && !this.slug && this.name) {
    this.slug = slugify(this.name);
  }
  next();
});

export const Hotel = mongoose.models.Hotel || mongoose.model<IHotel>("Hotel", HotelSchema);