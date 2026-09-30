import {
  findNavItemByPath,
  HOTEL_MODULE_PRESETS,
  hotelNavigationConfig,
} from "@/config/navigation";
import type { CustomerModuleKey } from "@/types/navigation";

/**
 * ============================================================================
 * DEMO AUTHENTICATION CONFIGURATION — PHASE 8
 * ============================================================================
 * Demo authentication only — replace with production authentication in a
 * later phase. These demo users, role → panel mappings and role → module
 * grants are DEVELOPMENT fixtures. Nothing here is a real credential and no
 * password/OTP verification happens anywhere in this phase.
 * ============================================================================
 */

/** All demo roles supported by the existing panel architecture. */
export type DemoRole =
  | "platform_super_admin"
  | "hotel_super_admin"
  | "manager"
  | "receptionist"
  | "room_management"
  | "booking_management"
  | "guest_management"
  | "housekeeping"
  | "restaurant"
  | "staff_management"
  | "inventory"
  | "finance"
  | "maintenance"
  | "security";

export interface DemoUser {
  /** Stable demo user id stored in the demo session. */
  id: string;
  name: string;
  /** Demo email — display only, never verified. */
  email: string;
  role: DemoRole;
  /** Human-readable role label shown in the UI. */
  roleName: string;
  /** Tenant scope for hotel staff. Omitted for the platform super admin. */
  hotelId?: string;
  /** Branch scope inside the hotel. Empty array = all branches of the hotel. */
  branchIds: string[];
}

/**
 * Centralized role → panel mapping.
 *
 * Platform Super Admin is intentionally separate from the customer hotel
 * panels (it is NOT merged into the tenant panel architecture).
 *
 * Note on hotel_super_admin: the example spec mapping used `/hotel`, but the
 * Phase 5 architecture already established the hotel panel home as a single
 * canonical dashboard route. To avoid duplicate routes it lives at
 * `/dashboard` — the hotel panel root.
 */
export const ROLE_PANELS: Record<DemoRole, string> = {
  platform_super_admin: "/admin",
  hotel_super_admin: "/dashboard",
  manager: "/manager",
  receptionist: "/reception",
  room_management: "/rooms",
  booking_management: "/bookings",
  guest_management: "/guests",
  housekeeping: "/housekeeping",
  restaurant: "/restaurant",
  staff_management: "/staff",
  inventory: "/inventory",
  finance: "/finance",
  maintenance: "/maintenance",
  security: "/security",
};

/** Every customer module (used by the hotel super admin, who owns them all). */
const ALL_CUSTOMER_MODULES: CustomerModuleKey[] = [
  "dashboard",
  "bookings",
  "rooms",
  "guests",
  "reception",
  "housekeeping",
  "restaurant",
  "staff",
  "inventory",
  "maintenance",
  "finance",
  "reports",
  "notifications",
  "settings",
  "website",
  "ai",
];

/**
 * Configuration-driven role → module grants for the customer hotel panel.
 * Not every hotel needs every module: a role's effective navigation is
 * `ROLE_MODULES[role] ∩ hotel plan modules` (see getEffectiveModules).
 * The platform super admin is not module-filtered (separate control plane).
 */
export const ROLE_MODULES: Record<DemoRole, CustomerModuleKey[]> = {
  platform_super_admin: [],
  hotel_super_admin: ALL_CUSTOMER_MODULES,
  manager: ["dashboard", "bookings", "rooms", "guests", "housekeeping", "staff", "reports"],
  receptionist: ["dashboard", "bookings", "rooms", "guests", "reception"],
  room_management: ["dashboard", "rooms"],
  booking_management: ["dashboard", "bookings", "rooms", "guests"],
  guest_management: ["dashboard", "guests", "bookings"],
  housekeeping: ["dashboard", "housekeeping", "rooms"],
  restaurant: ["dashboard", "restaurant"],
  staff_management: ["dashboard", "staff", "reports"],
  inventory: ["dashboard", "inventory", "reports"],
  finance: ["dashboard", "finance", "reports"],
  maintenance: ["dashboard", "maintenance", "rooms"],
  security: ["dashboard", "rooms", "reception"],
};

/**
 * Centralized demo users. ONE source of truth — no credentials are scattered
 * across components. Demo hotel/branch ids reuse the existing Phase 5 mock
 * tenant architecture so the shell, switcher and module presets all stay
 * consistent (no demo/prod data mixing).
 */
export const DEMO_USERS: DemoUser[] = [
  // ── Platform (internal — NOT a hotel tenant) ────────────────────────────
  {
    id: "demo-super-admin",
    name: "Ananya Deshmukh",
    email: "superadmin@demo.local",
    role: "platform_super_admin",
    roleName: "Platform Super Admin",
    branchIds: [],
  },

  // ── Hotel 01 — Grand Palace Heritage Resort (all modules enabled) ───────
  {
    id: "demo-owner",
    name: "Vikramaditya Rathore",
    email: "owner@demo.local",
    role: "hotel_super_admin",
    roleName: "Hotel Super Admin (Owner)",
    hotelId: "hotel-01",
    branchIds: ["branch-01", "branch-02", "branch-03"],
  },
  {
    id: "demo-manager",
    name: "Meera Chauhan",
    email: "manager@demo.local",
    role: "manager",
    roleName: "Hotel Manager",
    hotelId: "hotel-01",
    branchIds: ["branch-01"],
  },
  {
    id: "demo-reception",
    name: "Rohan Malhotra",
    email: "reception@demo.local",
    role: "receptionist",
    roleName: "Receptionist",
    hotelId: "hotel-01",
    branchIds: ["branch-01"],
  },
  {
    id: "demo-rooms",
    name: "Devendra Solanki",
    email: "rooms@demo.local",
    role: "room_management",
    roleName: "Room Management",
    hotelId: "hotel-01",
    branchIds: ["branch-01"],
  },
  {
    id: "demo-bookings",
    name: "Kavya Sharma",
    email: "bookings@demo.local",
    role: "booking_management",
    roleName: "Booking Management",
    hotelId: "hotel-01",
    branchIds: ["branch-01"],
  },
  {
    id: "demo-guests",
    name: "Aarav Mehta",
    email: "guests@demo.local",
    role: "guest_management",
    roleName: "Guest Management",
    hotelId: "hotel-01",
    branchIds: ["branch-01"],
  },
  {
    id: "demo-housekeeping",
    name: "Sunita Devi",
    email: "housekeeping@demo.local",
    role: "housekeeping",
    roleName: "Housekeeping",
    hotelId: "hotel-01",
    branchIds: ["branch-01"],
  },
  {
    id: "demo-restaurant",
    name: "Arjun Kapoor",
    email: "restaurant@demo.local",
    role: "restaurant",
    roleName: "Restaurant / POS",
    hotelId: "hotel-01",
    branchIds: ["branch-01"],
  },
  {
    id: "demo-staff",
    name: "Priya Nair",
    email: "staff@demo.local",
    role: "staff_management",
    roleName: "Staff Management",
    hotelId: "hotel-01",
    branchIds: ["branch-01"],
  },
  {
    id: "demo-inventory",
    name: "Imran Qureshi",
    email: "inventory@demo.local",
    role: "inventory",
    roleName: "Inventory",
    hotelId: "hotel-01",
    branchIds: ["branch-01"],
  },
  {
    id: "demo-finance",
    name: "Nandini Joshi",
    email: "finance@demo.local",
    role: "finance",
    roleName: "Finance / Accounts",
    hotelId: "hotel-01",
    branchIds: ["branch-01"],
  },
  {
    id: "demo-maintenance",
    name: "Ravi Patidar",
    email: "maintenance@demo.local",
    role: "maintenance",
    roleName: "Maintenance",
    hotelId: "hotel-01",
    branchIds: ["branch-01"],
  },
  {
    id: "demo-security",
    name: "Kartik Singh",
    email: "security@demo.local",
    role: "security",
    roleName: "Security",
    hotelId: "hotel-01",
    branchIds: ["branch-01"],
  },

  // ── Hotel 02 — The Meridian Metropolitan (resort / F&B plan) ────────────
  {
    id: "demo-m2-owner",
    name: "Neha Bhatia",
    email: "owner.meridian@demo.local",
    role: "hotel_super_admin",
    roleName: "Hotel Super Admin (Owner)",
    hotelId: "hotel-02",
    branchIds: ["branch-04", "branch-05"],
  },
  {
    id: "demo-m2-manager",
    name: "Arnav Gupta",
    email: "manager.meridian@demo.local",
    role: "manager",
    roleName: "Hotel Manager",
    hotelId: "hotel-02",
    branchIds: ["branch-04"],
  },
  {
    id: "demo-m2-reception",
    name: "Ishita Verma",
    email: "reception.meridian@demo.local",
    role: "receptionist",
    roleName: "Receptionist",
    hotelId: "hotel-02",
    branchIds: ["branch-04"],
  },
  {
    id: "demo-m2-restaurant",
    name: "Rahul Menon",
    email: "restaurant.meridian@demo.local",
    role: "restaurant",
    roleName: "Restaurant / POS",
    hotelId: "hotel-02",
    branchIds: ["branch-04"],
  },
  {
    id: "demo-m2-inventory",
    name: "Tanya Bose",
    email: "inventory.meridian@demo.local",
    role: "inventory",
    roleName: "Inventory",
    hotelId: "hotel-02",
    branchIds: ["branch-04"],
  },
  {
    id: "demo-m2-finance",
    name: "Sanjay Ahuja",
    email: "finance.meridian@demo.local",
    role: "finance",
    roleName: "Finance / Accounts",
    hotelId: "hotel-02",
    branchIds: ["branch-04"],
  },

  // ── Hotel 03 — Bayview Coastal Luxury Suites (boutique plan) ────────────
  {
    id: "demo-b3-owner",
    name: "Catherine Rodrigues",
    email: "owner.bayview@demo.local",
    role: "hotel_super_admin",
    roleName: "Hotel Super Admin (Owner)",
    hotelId: "hotel-03",
    branchIds: ["branch-06"],
  },
  {
    id: "demo-b3-manager",
    name: "Joseph Fernandes",
    email: "manager.bayview@demo.local",
    role: "manager",
    roleName: "Hotel Manager",
    hotelId: "hotel-03",
    branchIds: ["branch-06"],
  },
  {
    id: "demo-b3-reception",
    name: "Anita D'Souza",
    email: "reception.bayview@demo.local",
    role: "receptionist",
    roleName: "Receptionist",
    hotelId: "hotel-03",
    branchIds: ["branch-06"],
  },
  {
    id: "demo-b3-housekeeping",
    name: "Mariya Lakra",
    email: "housekeeping.bayview@demo.local",
    role: "housekeeping",
    roleName: "Housekeeping",
    hotelId: "hotel-03",
    branchIds: ["branch-06"],
  },
];

/** Grouped demo users for the login page and the demo switcher. */
export interface DemoUserGroup {
  id: string;
  label: string;
  hint: string;
  users: DemoUser[];
}

export const DEMO_USER_GROUPS: DemoUserGroup[] = [
  {
    id: "platform",
    label: "Platform (internal)",
    hint: "SaaS control plane — not a hotel tenant",
    users: DEMO_USERS.filter((user) => user.role === "platform_super_admin"),
  },
  {
    id: "hotel-01",
    label: "Grand Palace Heritage Resort",
    hint: "Udaipur · all modules enabled",
    users: DEMO_USERS.filter((user) => user.hotelId === "hotel-01"),
  },
  {
    id: "hotel-02",
    label: "The Meridian Metropolitan",
    hint: "New Delhi · resort & F&B plan",
    users: DEMO_USERS.filter((user) => user.hotelId === "hotel-02"),
  },
  {
    id: "hotel-03",
    label: "Bayview Coastal Luxury Suites",
    hint: "Goa · boutique plan",
    users: DEMO_USERS.filter((user) => user.hotelId === "hotel-03"),
  },
];

/** Routes that never require a demo session. */
export const PUBLIC_DEMO_ROUTES = ["/", "/login"];

/** Resolve a demo user by id (used to rebuild profile data from a session). */
export function getDemoUser(id: string): DemoUser | null {
  return DEMO_USERS.find((user) => user.id === id) ?? null;
}

/** Resolve the panel route for a demo role. */
export function getPanelRoute(role: DemoRole): string {
  return ROLE_PANELS[role];
}

/** True when the path is a platform (admin) panel route. */
export function isAdminPanelPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

/**
 * Effective modules for a hotel demo role: role grants intersected with the
 * hotel's plan modules. Configuration-driven — never assume every hotel has
 * every module. The platform super admin has no customer modules.
 */
export function getEffectiveModules(role: DemoRole, hotelId?: string): CustomerModuleKey[] {
  const roleModules = ROLE_MODULES[role] ?? [];
  if (!hotelId) return roleModules;
  const hotelModules = HOTEL_MODULE_PRESETS[hotelId] ?? [];
  return roleModules.filter((moduleKey) => hotelModules.includes(moduleKey));
}

/** True when the demo role may open the given hotel panel path. */
export function canRoleAccessHotelPath(role: DemoRole, pathname: string): boolean {
  if (role === "platform_super_admin") return false;

  // Dedicated role panels that are not part of the navigation config.
  if (pathname === "/manager" || pathname.startsWith("/manager/")) {
    return role === "manager" || role === "hotel_super_admin";
  }
  if (pathname === "/security" || pathname.startsWith("/security/")) {
    return role === "security" || role === "hotel_super_admin";
  }

  // Standard module routes resolve through the canonical navigation config,
  // so access follows the same moduleKey used by sidebar filtering.
  const lookup = findHotelNavItem(pathname);
  if (!lookup) return false;

  const moduleKey = lookup.moduleKey;
  if (!isCustomerModuleKey(moduleKey)) return false;
  return (ROLE_MODULES[role] ?? []).includes(moduleKey);
}

function isCustomerModuleKey(key: string): key is CustomerModuleKey {
  return !key.startsWith("platform_");
}

/**
 * Resolve the navigation moduleKey for a hotel panel path through the same
 * canonical navigation config the sidebar uses (so route protection and
 * navigation filtering can never drift apart).
 */
function findHotelNavItem(pathname: string): { moduleKey: string } | null {
  const lookup = findNavItemByPath(hotelNavigationConfig, pathname);
  return lookup ? { moduleKey: lookup.item.moduleKey } : null;
}
