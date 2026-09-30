/**
 * Shared Common TypeScript Types for HotelHub SaaS
 *
 * Provides foundational response, pagination, and status utility types
 * used across API route handlers, data access, and presentation layers.
 */

export type Status = "active" | "inactive" | "pending" | "archived";

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta | Record<string, unknown>;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetail;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

export interface DateRange {
  from: string | Date;
  to: string | Date;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}
