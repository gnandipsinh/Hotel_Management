import { NextRequest } from "next/server";
import { parsePagination } from "@/lib/db/pagination";
import { jsonOk, jsonError, handleRouteError, ApiError } from "@/lib/db/errors";
import { createBranch, getBranches } from "@/services/branch/branchService";
import { assertObjectId } from "@/lib/db/validate";

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const hotelId = searchParams.get("hotelId");
    if (!hotelId) return jsonError(ApiError.badRequest("hotelId is required"));
    assertObjectId(hotelId, "hotelId");

    const params = parsePagination(searchParams, {
      allowedSort: ["name", "code", "status", "city", "createdAt"],
    });
    const result = await getBranches({ ...params, hotelId });
    return jsonOk(result.items, result.meta);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const branch = await createBranch(body);
    return jsonOk(branch, undefined, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}