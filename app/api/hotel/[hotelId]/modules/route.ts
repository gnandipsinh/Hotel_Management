import { NextRequest } from "next/server";
import { jsonOk, handleRouteError, ApiError } from "@/lib/db/errors";
import { getHotelModules, assignHotelModule } from "@/services/module/moduleService";
import { assertObjectId } from "@/lib/db/validate";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> }
) {
  try {
    const { hotelId } = await params;
    assertObjectId(hotelId, "hotelId");
    const result = await getHotelModules(hotelId);
    return jsonOk(result.items);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> }
) {
  try {
    const { hotelId } = await params;
    assertObjectId(hotelId, "hotelId");
    const body = await request.json();
    const { moduleKey, configuration } = body;
    if (!moduleKey) return handleRouteError(new ApiError(400, "INVALID_INPUT", "moduleKey is required"));
    const result = await assignHotelModule(hotelId, moduleKey, configuration);
    return jsonOk(result, null, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}