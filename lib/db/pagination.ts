export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  sort: Record<string, 1 | -1>;
  search: string;
}

export const MAX_LIMIT = 100;
export const DEFAULT_LIMIT = 20;

export function clampLimit(limit: number, maxLimit: number = MAX_LIMIT): number {
  const parsed = Math.floor(Number(limit));
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_LIMIT;
  return Math.min(maxLimit, parsed);
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  [key: string]: unknown;
}

interface ParseOptions {
  allowedSort?: string[];
  defaultSort?: string;
  defaultLimit?: number;
  maxLimit?: number;
}

export function parsePagination(searchParams: URLSearchParams, options: ParseOptions = {}): PaginationParams {
  const {
    allowedSort = [],
    defaultSort = "-createdAt",
    defaultLimit = 20,
    maxLimit = 100,
  } = options;

  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const page = Number.isNaN(rawPage) ? 1 : Math.max(1, rawPage);
  const rawLimit = parseInt(searchParams.get("limit") || "", 10);
  const limit = clampLimit(Number.isNaN(rawLimit) ? defaultLimit : rawLimit, maxLimit);
  const skip = (page - 1) * limit;

  const rawSort = searchParams.get("sort") || defaultSort;
  const sortField = rawSort.startsWith("-") ? rawSort.slice(1) : rawSort;
  const sortOrder = rawSort.startsWith("-") ? -1 : 1;

  const sort: Record<string, 1 | -1> = allowedSort.length > 0 && !allowedSort.includes(sortField)
    ? { [defaultSort.startsWith("-") ? defaultSort.slice(1) : defaultSort]: defaultSort.startsWith("-") ? -1 : 1 }
    : { [sortField]: sortOrder };

  const search = searchParams.get("search")?.slice(0, 100) || "";

  return { page, limit, skip, sort, search };
}

export function buildMeta(total: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}