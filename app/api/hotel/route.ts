import { NextRequest } from "next/server";
import { parsePagination } from "@/lib/db/pagination";
import { jsonOk, handleRouteError } from "@/lib/db/errors";
import { createHotel, getHotels } from "@/services/hotel/hotelService";

export async function GET(request: NextRequest) {
  try {
    const params = parsePagination(new URL(request.url).searchParams, {
      allowedSort: ["name", "slug", "status", "city", "createdAt"],
    });
    const result = await getHotels({ ...params, status: request.nextUrl.searchParams.get("status") || undefined });
    return jsonOk(result.items, result.meta);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const hotel = await createHotel(body);
    return jsonOk(hotel, undefined, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}