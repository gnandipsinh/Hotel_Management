import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: { code: "NOT_IMPLEMENTED", message: "This endpoint is reserved for future phases" } },
    { status: 501 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: { code: "NOT_IMPLEMENTED", message: "This endpoint is reserved for future phases" } },
    { status: 501 }
  );
}