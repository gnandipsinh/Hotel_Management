import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const ErrorCode = {
  INVALID_INPUT: "INVALID_INPUT",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  FORBIDDEN: "FORBIDDEN",
  TENANT_ACCESS_ERROR: "TENANT_ACCESS_ERROR",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  DATABASE_ERROR: "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
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

  static tenantAccessDenied(message = "Cross-tenant access prohibited"): ApiError {
    return new ApiError(403, ErrorCode.TENANT_ACCESS_ERROR, message);
  }

  static notFound(message = "Resource not found"): ApiError {
    return new ApiError(404, ErrorCode.NOT_FOUND, message);
  }

  static conflict(message = "Resource already exists"): ApiError {
    return new ApiError(409, ErrorCode.CONFLICT, message);
  }

  static databaseError(message = "Database operation failed"): ApiError {
    return new ApiError(500, ErrorCode.DATABASE_ERROR, message);
  }

  static externalService(message = "External service unavailable"): ApiError {
    return new ApiError(502, ErrorCode.EXTERNAL_SERVICE_ERROR, message);
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

function isDbOfflineError(err: unknown): boolean {
  if (!err) return false;
  if (err instanceof mongoose.mongo.MongoNetworkError) return true;
  if (err instanceof mongoose.mongo.MongoServerSelectionError) return true;
  if (err instanceof Error) {
    const msg = err.message || "";
    const name = err.name;
    if (
      name === "MongooseError" ||
      name === "MongoNetworkError" ||
      name === "MongooseServerSelectionError" ||
      msg.includes("Database is not configured") ||
      msg.includes("buffering timed out") ||
      msg.includes("ECONNREFUSED") ||
      msg.includes("server selection timed out")
    ) {
      return true;
    }
  }
  return false;
}

export function handleRouteError(err: unknown): NextResponse {
  if (isDbOfflineError(err)) {
    console.warn("[AI Studio] Database offline — returning mock empty response");
    return jsonOk([], { page: 1, limit: 10, total: 0, totalPages: 0 });
  }
  return jsonError(normalizeDbError(err));
}