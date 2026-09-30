/**
 * Browser-side media API client.
 *
 * Every call consumes the `{ success, data | error }` envelope and throws a
 * typed `ApiClientError` with a user-safe message. Storage keys and provider
 * secrets are never part of these contracts.
 */

import type { BranchOption, FileAssetDto, HotelOption, PaginationMeta } from "@/types/media";

export class ApiClientError extends Error {
  readonly code: string;
  readonly details?: Record<string, string[]>;

  constructor(message: string, code = "INTERNAL_ERROR", details?: Record<string, string[]>) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.details = details;
  }
}

interface Envelope<T> {
  success: boolean;
  data?: T;
  meta?: PaginationMeta;
  error?: { code: string; message: string; details?: Record<string, string[]> };
}

async function parse<T>(response: Response): Promise<{ data?: T; meta?: PaginationMeta }> {
  let body: Envelope<T> | null = null;
  try {
    body = (await response.json()) as Envelope<T>;
  } catch {
    throw new ApiClientError("The server returned an unexpected response");
  }

  if (!response.ok || !body.success || body.error) {
    throw new ApiClientError(
      body.error?.message || "Something went wrong",
      body.error?.code || "INTERNAL_ERROR",
      body.error?.details,
    );
  }
  return { data: body.data, meta: body.meta };
}

export async function apiGet<T>(path: string): Promise<{ data?: T; meta?: PaginationMeta }> {
  const response = await fetch(path, { cache: "no-store" });
  return parse<T>(response);
}

export async function apiSend<T>(
  path: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<{ data?: T; meta?: PaginationMeta }> {
  const response = await fetch(path, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return parse<T>(response);
}

/** XHR-based upload so real progress events are available. */
export function uploadWithProgress(
  path: string,
  formData: FormData,
  onProgress: (percent: number) => void,
): Promise<FileAssetDto> {
  return new Promise<FileAssetDto>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", path);
    xhr.responseType = "text";

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
      }
    };

    xhr.onerror = () =>
      reject(new ApiClientError("Network error — check your connection and retry", "NETWORK_ERROR"));

    xhr.ontimeout = () =>
      reject(new ApiClientError("The upload timed out — please retry", "TIMEOUT"));

    xhr.onload = () => {
      let body: Envelope<FileAssetDto> | null = null;
      try {
        body = JSON.parse(xhr.responseText) as Envelope<FileAssetDto>;
      } catch {
        reject(new ApiClientError("The server returned an unexpected response"));
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300 && body.success && body.data) {
        resolve(body.data);
      } else {
        reject(
          new ApiClientError(
            body.error?.message || "Upload failed",
            body.error?.code || "INTERNAL_ERROR",
            body.error?.details,
          ),
        );
      }
    };

    xhr.send(formData);
  });
}

export interface ListFilesQuery {
  hotelId: string;
  category?: string;
  entityType?: string;
  entityId?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export async function listFileAssets(
  query: ListFilesQuery,
): Promise<{ items: FileAssetDto[]; meta: PaginationMeta }> {
  const params = new URLSearchParams({ hotelId: query.hotelId, limit: String(query.limit ?? 60) });
  if (query.category) params.set("category", query.category);
  if (query.entityType) params.set("entityType", query.entityType);
  if (query.entityId) params.set("entityId", query.entityId);
  if (query.page) params.set("page", String(query.page));
  if (query.sort) params.set("sort", query.sort);

  const result = await apiGet<FileAssetDto[]>(`/api/files?${params.toString()}`);
  return { items: result.data ?? [], meta: result.meta! };
}

export async function deleteFileAsset(fileId: string, hotelId: string): Promise<FileAssetDto> {
  const result = await apiSend<FileAssetDto>(
    `/api/files/${fileId}?hotelId=${encodeURIComponent(hotelId)}`,
    "DELETE",
  );
  return result.data!;
}

export interface FilePatch {
  sortOrder?: number;
  isPrimary?: boolean;
}

export async function patchFileAsset(
  fileId: string,
  hotelId: string,
  patch: FilePatch,
): Promise<FileAssetDto> {
  const result = await apiSend<FileAssetDto>(
    `/api/files/${fileId}?hotelId=${encodeURIComponent(hotelId)}`,
    "PATCH",
    patch,
  );
  return result.data!;
}

export async function fetchHotelOptions(): Promise<HotelOption[]> {
  const result = await apiGet<HotelOption[]>("/api/hotel?limit=100&sort=name");
  return result.data ?? [];
}

export async function fetchBranchOptions(hotelId: string): Promise<BranchOption[]> {
  const result = await apiGet<BranchOption[]>(
    `/api/branch?hotelId=${encodeURIComponent(hotelId)}&limit=100&sort=name`,
  );
  return result.data ?? [];
}

export async function createDemoHotel(): Promise<HotelOption> {
  const slug = `demo-hotel-${Date.now().toString(36)}`;
  const result = await apiSend<HotelOption>("/api/hotel", "POST", {
    name: "Demo Hotel",
    email: `${slug}@example.com`,
    address: "1 Demo Street",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pincode: "400001",
    slug,
  });
  return result.data!;
}

/** Creates a branch so the room/restaurant media flows can be exercised. */
export async function createDemoBranch(hotelId: string): Promise<BranchOption> {
  const suffix = Date.now().toString(36).toUpperCase().slice(-6);
  const result = await apiSend<BranchOption>("/api/branch", "POST", {
    hotelId,
    name: `Demo Branch ${suffix}`,
    code: `D${suffix}`.slice(0, 20),
    address: "1 Demo Street",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pincode: "400001",
  });
  return result.data!;
}
