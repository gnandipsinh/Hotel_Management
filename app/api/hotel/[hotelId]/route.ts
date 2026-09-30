import { NextRequest } from "next/server";
import { jsonOk, handleRouteError } from "@/lib/db/errors";
import { getHotelById } from "@/services/hotel/hotelService";
import { assertObjectId } from "@/lib/db/validate";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> }
) {
  try {
    const { hotelId } = await params;
    assertObjectId(hotelId, "hotelId");
    const hotel = await getHotelById(hotelId);
    return jsonOk(hotel);
  } catch (err) {
    return handleRouteError(err);
  }
}