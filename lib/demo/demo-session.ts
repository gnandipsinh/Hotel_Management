/**
 * ============================================================================
 * DEMO SESSION — PHASE 8
 * ============================================================================
 * Demo authentication only — replace with production authentication in a
 * later phase. This module is deliberately isolated in `lib/demo/` so the
 * entire client-side demo session can be ripped out and replaced by real
 * auth (OTP / server sessions / RBAC) without touching feature code.
 *
 * The session stores ONLY non-sensitive information:
 *   demo user id, role, display name, hotel id, branch ids.
 * It never stores passwords, OTPs, tokens, API keys or secrets.
 * Client-side (localStorage) storage is acceptable for this demo phase.
 * ============================================================================
 */

import * as React from "react";
import {
  getDemoUser,
  getPanelRoute,
  PUBLIC_DEMO_ROUTES,
  ROLE_PANELS,
  canRoleAccessHotelPath,
  isAdminPanelPath,
} from "@/config/demo";
import type { DemoRole, DemoUser } from "@/config/demo";
import type { UserProfile } from "@/types/context";

const STORAGE_KEY = "hotelsync.demo-session.v1";
const SESSION_EVENT = "hotelsync:demo-session-changed";

export interface DemoSession {
  /** Demo user id from the centralized DEMO_USERS configuration. */
  uid: string;
  role: DemoRole;
  /** Display name only — never a credential. */
  name: string;
  /** Tenant scope for hotel staff; omitted for the platform super admin. */
  hotelId?: string;
  branchIds: string[];
}

function browserStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isDemoRole(value: unknown): value is DemoRole {
  return typeof value === "string" && value in ROLE_PANELS;
}

/** Structural validation + sanitization: unknown fields are dropped. */
function parseSession(raw: string | null): DemoSession | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const candidate = parsed as Record<string, unknown>;
    if (typeof candidate.uid !== "string" || candidate.uid.length === 0) return null;
    if (!isDemoRole(candidate.role)) return null;
    if (typeof candidate.name !== "string" || candidate.name.length === 0) return null;
    if (!Array.isArray(candidate.branchIds)) return null;
    const branchIds = candidate.branchIds.filter(
      (branchId): branchId is string => typeof branchId === "string",
    );
    const session: DemoSession = {
      uid: candidate.uid,
      role: candidate.role,
      name: candidate.name,
      branchIds,
    };
    if (typeof candidate.hotelId === "string") {
      session.hotelId = candidate.hotelId;
    }
    return session;
  } catch {
    return null;
  }
}

// Cache keyed by the raw serialized value so every snapshot is referentially
// stable (required by useSyncExternalStore) while still reacting to changes.
let sessionCache: { raw: string | null; value: DemoSession | null } | null = null;

function readSession(): DemoSession | null {
  const storage = browserStorage();
  if (!storage) return null;
  const raw = storage.getItem(STORAGE_KEY);
  if (sessionCache && sessionCache.raw === raw) return sessionCache.value;
  const value = parseSession(raw);
  sessionCache = { raw, value };
  return value;
}

function emitChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SESSION_EVENT));
}

/** Direct (non-reactive) read of the current demo session. */
export function getDemoSession(): DemoSession | null {
  return readSession();
}

/**
 * Create/replace the demo session for a selected demo user.
 * Demo authentication only — no credential is verified anywhere.
 */
export function createDemoSession(user: DemoUser): DemoSession {
  const session: DemoSession = {
    uid: user.id,
    role: user.role,
    name: user.name,
    branchIds: [...user.branchIds],
  };
  if (user.hotelId) session.hotelId = user.hotelId;

  const storage = browserStorage();
  if (storage) {
    storage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
  emitChange();
  return session;
}

/** Clear the demo session (logout / switch user). Leaves no auth state behind. */
export function clearDemoSession(): void {
  const storage = browserStorage();
  if (storage) {
    storage.removeItem(STORAGE_KEY);
  }
  emitChange();
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event: StorageEvent): void => {
    if (event.key === STORAGE_KEY || event.key === null) onStoreChange();
  };
  window.addEventListener(SESSION_EVENT, onStoreChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(SESSION_EVENT, onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** Reactive demo session (null on the server and before hydration). */
export function useDemoSession(): DemoSession | null {
  return React.useSyncExternalStore(subscribe, readSession, () => null);
}

function subscribeNoop(): () => void {
  return () => {};
}

/** True once the client has hydrated (distinguishes "no session" from "unknown yet"). */
export function useDemoHydrated(): boolean {
  return React.useSyncExternalStore(subscribeNoop, () => true, () => false);
}

/** Resolve the full demo user configuration for a session (null if stale). */
export function resolveDemoUser(session: DemoSession | null): DemoUser | null {
  if (!session) return null;
  return getDemoUser(session.uid);
}

/** Build the shell user profile from a demo session. */
export function getDemoUserProfile(session: DemoSession | null): UserProfile | null {
  const user = resolveDemoUser(session);
  if (!session || !user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    roleName: user.roleName,
    assignedBranchIds: session.branchIds,
    isPlatformAdmin: user.role === "platform_super_admin",
  };
}

/**
 * Demo route protection (NOT production RBAC).
 * Returns true when the demo role may open the given pathname.
 */
export function canAccessDemoRoute(role: DemoRole, pathname: string): boolean {
  if (PUBLIC_DEMO_ROUTES.includes(pathname)) return true;

  // Platform Super Admin is separate from the customer hotel panels:
  // it may only open /admin routes, and hotel roles may never open /admin.
  if (role === "platform_super_admin") return isAdminPanelPath(pathname);
  if (isAdminPanelPath(pathname)) return false;

  return canRoleAccessHotelPath(role, pathname);
}

/**
 * Resolve where login should send the user: the validated `next` target when
 * this role may open it, otherwise the role's own panel route.
 */
export function getLoginRedirectPath(session: DemoSession | null, next?: string | null): string {
  if (!session) return "/login";
  if (
    next &&
    next.startsWith("/") &&
    !next.startsWith("//") &&
    canAccessDemoRoute(session.role, next)
  ) {
    return next;
  }
  return getPanelRoute(session.role);
}
