import { connectDB } from "@/lib/db/mongoose";
import { Hotel } from "@/models/Hotel";
import { buildMeta, clampLimit } from "@/lib/db/pagination";
import { escapeRegex } from "@/lib/db/validate";
import { ApiError, normalizeDbError } from "@/lib/db/errors";
import type { IHotel } from "@/models/Hotel";
import mongoose from "mongoose";

function toHotelDoc(doc: IHotel) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    legalName: doc.legalName,
    slug: doc.slug,
    email: doc.email,
    phone: doc.phone,
    alternatePhone: doc.alternatePhone,
    address: doc.address,
    city: doc.city,
    state: doc.state,
    country: doc.country,
    pincode: doc.pincode,
    logo: doc.logo,
    coverImage: doc.coverImage,
    timezone: doc.timezone,
    currency: doc.currency,
    locale: doc.locale,
    gstDetails: doc.gstDetails,
    status: doc.status,
    subscription: doc.subscription,
    settings: doc.settings,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function createHotel(input: {
  name: string;
  legalName?: string;
  slug?: string;
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
  timezone?: string;
  currency?: string;
  locale?: string;
  gstDetails?: IHotel["gstDetails"];
  status?: "pending" | "active" | "inactive" | "suspended";
}): Promise<ReturnType<typeof toHotelDoc>> {
  await connectDB();

  const slug = input.slug?.toLowerCase().trim() || slugify(input.name);
  const exists = await Hotel.exists({ slug });
  if (exists) throw ApiError.conflict("A hotel with this slug already exists");

  try {
    const hotel = await Hotel.create({
      ...input,
      slug,
      timezone: input.timezone || "Asia/Kolkata",
      currency: input.currency || "INR",
      locale: input.locale || "en-IN",
      status: input.status || "pending",
    });
    return toHotelDoc(hotel);
  } catch (e) {
    throw normalizeDbError(e);
  }
}

export async function getHotels(params: {
  page: number;
  limit: number;
  skip: number;
  sort: Record<string, 1 | -1>;
  search: string;
  status?: string;
}) {
  await connectDB();

  const { page, search, status } = params;
  const limit = clampLimit(params.limit);
  const skip = (page - 1) * limit;
  const filter: Record<string, unknown> = {};

  if (status) filter.status = status;

  if (search) {
    const rx = escapeRegex(search);
    filter.$or = [
      { name: { $regex: rx, $options: "i" } },
      { slug: { $regex: rx, $options: "i" } },
      { city: { $regex: rx, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    Hotel.find(filter).sort(params.sort).skip(skip).limit(limit).lean().exec(),
    Hotel.countDocuments(filter),
  ]);

  return {
    items: items.map((doc) => toHotelDoc(doc as unknown as IHotel)),
    meta: buildMeta(total, page, limit),
  };
}

export async function getHotelById(id: string) {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) throw ApiError.badRequest("Invalid hotel ID");
  const hotel = await Hotel.findById(id).lean().exec();
  if (!hotel) throw ApiError.notFound("Hotel not found");
  return toHotelDoc(hotel as unknown as IHotel);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}