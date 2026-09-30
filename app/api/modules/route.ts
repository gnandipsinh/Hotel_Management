import { NextRequest } from "next/server";
import { parsePagination } from "@/lib/db/pagination";
import { jsonOk, handleRouteError } from "@/lib/db/errors";
import { listModuleCatalog } from "@/services/module/moduleService";

export async function GET(request: NextRequest) {
  try {
    const params = parsePagination(new URL(request.url).searchParams, {
      allowedSort: ["key", "name", "category", "createdAt"],
    });
    const result = await listModuleCatalog(params);
    return jsonOk(result.items, result.meta);
  } catch (err) {
    return handleRouteError(err);
  }
}