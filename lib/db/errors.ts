import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const ErrorCode = {
  INVALID_INPUT: "INVALID_INPUT",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCodeType;
  public details?: Record<string, string[]>;

  constructor(
    statusCode: number,
    code: ErrorCodeType,
    message: string,
    details?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static badRequest(message = "Invalid input", details?: Record<string, string[]>): ApiError {
    return new ApiError(400, ErrorCode.INVALID_INPUT, message, details);
  }

  static unauthorized(message = "Authentication required"): ApiError {
    return new ApiError(401, ErrorCode.UNAUTHENTICATED, message);
  }

  static forbidden(message = "Permission denied"): ApiError {
    return new ApiError(403, ErrorCode.FORBIDDEN, message);
  }

  static notFound(message = "Resource not found"): ApiError {
    return new ApiError(404, ErrorCode.NOT_FOUND, message);
  }

  static conflict(message = "Resource already exists"): ApiError {
    return new ApiError(409, ErrorCode.CONFLICT, message);
  }

  static internal(message = "Internal server error"): ApiError {
    return new ApiError(500, ErrorCode.INTERNAL_ERROR, message);
  }
}

function formatValidationError(err: mongoose.Error.ValidationError): Record<string, string[]> {
  const details: Record<string, string[]> = {};
  for (const [field, error] of Object.entries(err.errors)) {
    details[field] = [error.message];
  }
  return details;
}

function formatDuplicateError(err: mongoose.mongo.MongoServerError): { message: string; details?: Record<string, string[]> } {
  const keyValue = err.keyValue ? JSON.stringify(err.keyValue) : "unknown";
  const field = Object.keys(err.keyPattern || {})[0] || "field";
  return {
    message: `A record with this ${field} already exists`,
    details: { [field]: [keyValue] },
  };
}

export function normalizeDbError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;

  if (err instanceof Error && err.message.startsWith("INVALID_OBJECT_ID:")) {
    const field = err.message.split(":")[1] || "id";
    return ApiError.badRequest(`Invalid ${field}`);
  }

  if (err instanceof Error && err.message === "NOT_FOUND") {
    return ApiError.notFound();
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return ApiError.badRequest("Validation failed", formatValidationError(err));
  }

  if (err instanceof mongoose.Error.CastError) {
    return ApiError.badRequest(`Invalid value for ${err.path}: ${err.value}`);
  }

  if (err instanceof mongoose.mongo.MongoServerError) {
    if (err.code === 11000) {
      const { message, details } = formatDuplicateError(err);
      const e = new ApiError(409, ErrorCode.CONFLICT, message);
      e.details = details;
      return e;
    }
    if (err.code === 121) {
      return ApiError.conflict("Document validation failed");
    }
  }

  if (err instanceof mongoose.mongo.MongoNetworkError) {
    return ApiError.internal("Database connection failed");
  }

  if (err instanceof Error && err.message === "Database is not configured. Set MONGODB_URI and MONGODB_DB_NAME.") {
    return ApiError.internal("Database is not configured");
  }

  console.error("Unhandled database error:", err);
  return ApiError.internal();
}

export function jsonOk<T>(data: T, meta?: Record<string, unknown> | null, init?: number): NextResponse {
  return NextResponse.json(
    { success: true, data, ...(meta && { meta }) },
    { status: init ?? 200 },
  );
}

export function jsonError(err: ApiError): NextResponse {
  const body = {
    success: false,
    error: {
      code: err.code,
      message: err.message,
      ...(err.details && { details: err.details }),
    },
  };
  return NextResponse.json(body, { status: err.statusCode });
}

export function handleRouteError(err: unknown): NextResponse {
  return jsonError(normalizeDbError(err));
}