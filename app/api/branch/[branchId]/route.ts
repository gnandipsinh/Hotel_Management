import { NextRequest } from "next/server";
import { jsonOk, handleRouteError } from "@/lib/db/errors";
import { getBranchById } from "@/services/branch/branchService";
import { assertObjectId } from "@/lib/db/validate";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ branchId: string }> }
) {
  try {
    const { branchId } = await params;
    assertObjectId(branchId, "branchId");
    const searchParams = new URL(request.url).searchParams;
    const hotelId = searchParams.get("hotelId") || undefined;
    if (hotelId) assertObjectId(hotelId, "hotelId");
    const branch = await getBranchById(branchId, hotelId);
    return jsonOk(branch);
  } catch (err) {
    return handleRouteError(err);
  }
}