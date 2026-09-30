import { Types } from "mongoose";

export interface TenantScope {
  hotelId: string;
  branchId?: string;
}

export interface TenantContext extends TenantScope {
  userId?: string;
  permissions?: string[];
}

let tenantContext: TenantContext | null = null;

export function getTenantContext(): TenantContext | null {
  return tenantContext;
}

export function setTenantContext(ctx: TenantContext): void {
  tenantContext = ctx;
}

export function clearTenantContext(): void {
  tenantContext = null;
}

export function hotelScope(hotelId: string): TenantScope {
  return { hotelId };
}

export function branchScope(hotelId: string, branchId: string): TenantScope {
  return { hotelId, branchId };
}

export function withTenant<T extends Record<string, unknown>>(
  filter: T,
  scope: TenantScope
): T & { hotelId: string; branchId?: string } {
  const result = { ...filter } as T & { hotelId: string; branchId?: string };
  result.hotelId = scope.hotelId;
  if (scope.branchId) {
    result.branchId = scope.branchId;
  }
  return result;
}

export function assertDocInScope<T extends { hotelId?: string; branchId?: string }>(
  doc: T | null,
  scope: TenantScope
): T {
  if (!doc) {
    throw new Error("NOT_FOUND");
  }
  if (doc.hotelId !== scope.hotelId) {
    throw new Error("NOT_FOUND");
  }
  if (scope.branchId && doc.branchId !== scope.branchId) {
    throw new Error("NOT_FOUND");
  }
  return doc;
}

export function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}

export function assertObjectId(id: string, field = "id"): void {
  if (!isValidObjectId(id)) {
    throw new Error(`INVALID_OBJECT_ID:${field}`);
  }
}

export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}