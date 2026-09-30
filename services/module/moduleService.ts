import { connectDB } from "@/lib/db/mongoose";
import { Module } from "@/models/Module";
import { HotelModule } from "@/models/HotelModule";
import { Hotel } from "@/models/Hotel";
import { buildMeta, clampLimit } from "@/lib/db/pagination";
import { escapeRegex } from "@/lib/db/validate";
import { ApiError, normalizeDbError } from "@/lib/db/errors";
import mongoose from "mongoose";

interface ModuleLean {
  _id: mongoose.Types.ObjectId;
  key: string;
  name: string;
  description?: string;
  iconKey?: string;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface HotelModuleLean {
  _id: mongoose.Types.ObjectId;
  hotelId: mongoose.Types.ObjectId;
  moduleKey: string;
  enabled: boolean;
  enabledAt?: Date;
  configuration?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

function toModuleDoc(doc: ModuleLean) {
  return {
    id: doc._id.toString(),
    key: doc.key,
    name: doc.name,
    description: doc.description,
    iconKey: doc.iconKey,
    category: doc.category,
    isActive: doc.isActive,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function toHotelModuleDoc(doc: HotelModuleLean) {
  return {
    id: doc._id.toString(),
    hotelId: doc.hotelId.toString(),
    moduleKey: doc.moduleKey,
    enabled: doc.enabled,
    enabledAt: doc.enabledAt,
    configuration: doc.configuration,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function listModuleCatalog(params: {
  page: number;
  limit: number;
  skip: number;
  sort: Record<string, 1 | -1>;
  search: string;
}) {
  await connectDB();

  const { page, search } = params;
  const limit = clampLimit(params.limit);
  const skip = (page - 1) * limit;
  const filter: Record<string, unknown> = { isActive: true };

  if (search) {
    const rx = escapeRegex(search);
    filter.$or = [
      { key: { $regex: rx, $options: "i" } },
      { name: { $regex: rx, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    Module.find(filter).sort(params.sort).skip(skip).limit(limit).lean().exec(),
    Module.countDocuments(filter),
  ]);

  return {
    items: items.map((doc) => toModuleDoc(doc as unknown as ModuleLean)),
    meta: buildMeta(total, page, limit),
  };
}

export async function getHotelModules(hotelId: string) {
  await connectDB();

  if (!mongoose.isValidObjectId(hotelId)) throw ApiError.badRequest("Invalid hotel ID");

  const hotel = await Hotel.findById(hotelId).lean().exec();
  if (!hotel) throw ApiError.notFound("Hotel not found");

  const modules = (await HotelModule.find({ hotelId, enabled: true })
    .sort({ enabledAt: -1 })
    .lean()
    .exec()) as unknown as HotelModuleLean[];

  return {
    items: modules.map((m) => toHotelModuleDoc(m)),
  };
}

export async function assignHotelModule(hotelId: string, moduleKey: string, configuration?: Record<string, unknown>) {
  await connectDB();

  if (!mongoose.isValidObjectId(hotelId)) throw ApiError.badRequest("Invalid hotel ID");

  const hotel = await Hotel.findById(hotelId).lean().exec();
  if (!hotel) throw ApiError.notFound("Hotel not found");

  const moduleDoc = await Module.findOne({ key: moduleKey, isActive: true }).lean().exec();
  if (!moduleDoc) throw ApiError.notFound("Module not found or inactive");

  const exists = await HotelModule.findOne({ hotelId, moduleKey }).lean().exec();
  if (exists) throw ApiError.conflict("Module is already assigned to this hotel");

  const hotelModule = await HotelModule.create({
    hotelId,
    moduleKey,
    enabled: true,
    enabledAt: new Date(),
    configuration: configuration || {},
  }).catch((e: unknown) => {
    throw normalizeDbError(e);
  });

  return toHotelModuleDoc(hotelModule);
}