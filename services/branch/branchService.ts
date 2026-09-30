import { connectDB } from "@/lib/db/mongoose";
import { Branch, validateBranchCode } from "@/models/Branch";
import { Hotel } from "@/models/Hotel";
import { buildMeta, clampLimit } from "@/lib/db/pagination";
import { escapeRegex } from "@/lib/db/validate";
import { ApiError, normalizeDbError } from "@/lib/db/errors";
import mongoose from "mongoose";

interface BranchDoc {
  _id: mongoose.Types.ObjectId;
  hotelId: mongoose.Types.ObjectId;
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
  status: string;
  settings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

function toBranchDoc(doc: BranchDoc) {
  return {
    id: doc._id.toString(),
    hotelId: doc.hotelId.toString(),
    name: doc.name,
    code: doc.code,
    email: doc.email,
    phone: doc.phone,
    address: doc.address,
    city: doc.city,
    state: doc.state,
    country: doc.country,
    pincode: doc.pincode,
    timezone: doc.timezone,
    status: doc.status,
    settings: doc.settings,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function createBranch(input: {
  hotelId: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  timezone?: string;
}): Promise<ReturnType<typeof toBranchDoc>> {
  await connectDB();

  if (!mongoose.isValidObjectId(input.hotelId)) throw ApiError.badRequest("Invalid hotel ID");
  const hotel = await Hotel.findById(input.hotelId).lean().exec();
  if (!hotel) throw ApiError.notFound("Hotel not found");

  const code = input.code.toUpperCase().trim();
  if (!validateBranchCode(code)) throw ApiError.badRequest("Branch code must be 2-20 alphanumeric characters");

  const exists = await Branch.exists({ hotelId: input.hotelId, code });
  if (exists) throw ApiError.conflict("A branch with this code already exists for this hotel");

  const branch = await Branch.create({
    ...input,
    hotelId: input.hotelId,
    code,
    timezone: input.timezone || "Asia/Kolkata",
    status: "active",
  }).catch((e: unknown) => {
    throw normalizeDbError(e);
  });

  return toBranchDoc(branch);
}

export async function getBranches(params: {
  hotelId: string;
  page: number;
  limit: number;
  skip: number;
  sort: Record<string, 1 | -1>;
  search: string;
}) {
  await connectDB();

  if (!mongoose.isValidObjectId(params.hotelId)) throw ApiError.badRequest("Invalid hotel ID");

  const { page, search } = params;
  const limit = clampLimit(params.limit);
  const skip = (page - 1) * limit;
  const filter: Record<string, unknown> = { hotelId: params.hotelId };

  if (search) {
    const rx = escapeRegex(search);
    filter.$or = [
      { name: { $regex: rx, $options: "i" } },
      { code: { $regex: rx, $options: "i" } },
      { city: { $regex: rx, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    Branch.find(filter).sort(params.sort).skip(skip).limit(limit).lean().exec() as unknown as Promise<BranchDoc[]>,
    Branch.countDocuments(filter),
  ]);

  return {
    items: items.map((doc) => toBranchDoc(doc)),
    meta: buildMeta(total, page, limit),
  };
}

export async function getBranchById(branchId: string, hotelId?: string) {
  await connectDB();

  if (!mongoose.isValidObjectId(branchId)) throw ApiError.badRequest("Invalid branch ID");

  const branch = await Branch.findById(branchId).lean().exec() as BranchDoc | null;
  if (!branch) throw ApiError.notFound("Branch not found");

  if (hotelId && branch.hotelId.toString() !== hotelId) {
    throw ApiError.notFound("Branch not found");
  }

  return toBranchDoc(branch);
}