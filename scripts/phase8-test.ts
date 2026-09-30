import fs from "node:fs";
import path from "node:path";
import {
  DEMO_USERS,
  DEMO_USER_GROUPS,
  PUBLIC_DEMO_ROUTES,
  ROLE_MODULES,
  ROLE_PANELS,
  canRoleAccessHotelPath,
  getDemoUser,
  getEffectiveModules,
  getPanelRoute,
} from "@/config/demo";
import {
  findNavItemByPath,
  getVisibleNavigation,
  HOTEL_MODULE_PRESETS,
  hotelNavigationConfig,
  internalAdminNavigationConfig,
} from "@/config/navigation";
import {
  canAccessDemoRoute,
  clearDemoSession,
  createDemoSession,
  getDemoUserProfile,
  getLoginRedirectPath,
  getDemoSession,
  resolveDemoUser,
} from "@/lib/demo/demo-session";
import { MOCK_BRANCHES, MOCK_HOTELS } from "@/lib/mock-data";

/**
 * Phase 8 — Demo Authentication + Role-Based Panel Routing test suite.
 * Covers demo users, role→panel routing, demo session, route protection,
 * module access and the structural wiring of guards/pages.
 *
 * Demo authentication only — these tests validate the demo layer, never
 * production security.
 */

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function assertEqual<T>(actual: T, expected: T, label: string): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

async function runTest(name: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log(`  [PASS] ${name}`);
  } catch (e) {
    results.push({ name, passed: false, error: String(e) });
    console.log(`  [FAIL] ${name}: ${e}`);
  }
}

// ── In-memory browser shims (demo session reads localStorage) ──────────────
class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length(): number {
    return this.map.size;
  }
  clear(): void {
    this.map.clear();
  }
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  key(index: number): string | null {
    return [...this.map.keys()][index] ?? null;
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
}

class FakeWindow extends EventTarget {
  localStorage = new MemoryStorage();
}

const STORAGE_KEY = "hotelsync.demo-session.v1";
const ALL_ROLES = Object.keys(ROLE_PANELS) as (keyof typeof ROLE_PANELS)[];

const EXPECTED_ROLE_COUNT = 14;

function topLevelNavTitles(modules: Parameters<typeof getVisibleNavigation>[0]["enabledModules"]): string[] {
  const visible = getVisibleNavigation({
    config: hotelNavigationConfig,
    enabledModules: modules,
  });
  return visible.sections.flatMap((section) => section.items.map((item) => item.title));
}

function appFileExists(relativePath: string): boolean {
  return fs.existsSync(path.join(process.cwd(), relativePath));
}

async function main() {
  console.log("Phase 8 Test Suite — Demo Auth + Panel Routing");
  console.log("==============================================\n");

  (globalThis as { window?: unknown }).window = new FakeWindow();

  // ── 1. Demo user configuration ──────────────────────────────────────────
  await runTest("1. Exactly 14 roles with panel + module configuration", () => {
    assertEqual(ALL_ROLES.length, EXPECTED_ROLE_COUNT, "role count");
    for (const role of ALL_ROLES) {
      assert(ROLE_PANELS[role].startsWith("/"), `panel route missing for ${role}`);
      assert(Array.isArray(ROLE_MODULES[role]), `role modules missing for ${role}`);
    }
  });

  await runTest("2. Demo users cover every role, ids and emails unique", () => {
    for (const role of ALL_ROLES) {
      assert(
        DEMO_USERS.some((user) => user.role === role),
        `no demo user for role ${role}`,
      );
    }
    const ids = DEMO_USERS.map((user) => user.id);
    const emails = DEMO_USERS.map((user) => user.email);
    assertEqual(new Set(ids).size, ids.length, "duplicate demo user ids");
    assertEqual(new Set(emails).size, emails.length, "duplicate demo emails");
  });

  await runTest("3. Demo groups partition all demo users", () => {
    const groupedIds = DEMO_USER_GROUPS.flatMap((group) => group.users.map((user) => user.id));
    assertEqual(groupedIds.length, DEMO_USERS.length, "grouped count");
    assertEqual(new Set(groupedIds).size, DEMO_USERS.length, "grouped unique");
    for (const group of DEMO_USER_GROUPS) {
      assert(group.users.length > 0, `empty group ${group.id}`);
    }
  });

  await runTest("4. Hotel/branch scope integrity (tenant mixing guard)", () => {
    const hotelIds = new Set(MOCK_HOTELS.map((hotel) => hotel.id));
    const branchHotel = new Map(MOCK_BRANCHES.map((branch) => [branch.id, branch.hotelId]));
    for (const user of DEMO_USERS) {
      if (user.role === "platform_super_admin") {
        assert(!user.hotelId, `${user.id}: platform user must not have a hotelId`);
        assertEqual(user.branchIds.length, 0, `${user.id}: platform branchIds`);
        continue;
      }
      assert(
        typeof user.hotelId === "string" && hotelIds.has(user.hotelId),
        `${user.id}: invalid hotelId`,
      );
      assert(user.branchIds.length > 0, `${user.id}: hotel user needs branchIds`);
      for (const branchId of user.branchIds) {
        assert(
          branchHotel.get(branchId) === user.hotelId,
          `${user.id}: branch ${branchId} does not belong to ${user.hotelId}`,
        );
      }
    }
  });

  await runTest("5. Every role panel route resolves to a real route", () => {
    const staticPanels: Record<string, string> = {
      "/admin": "app/admin/page.tsx",
      "/dashboard": "app/dashboard/page.tsx",
      "/manager": "app/manager/page.tsx",
      "/security": "app/security/page.tsx",
    };
    for (const role of ALL_ROLES) {
      const route = getPanelRoute(role);
      if (staticPanels[route]) {
        assert(appFileExists(staticPanels[route]), `${route}: page file missing`);
        continue;
      }
      const hotelLookup = findNavItemByPath(hotelNavigationConfig, route);
      assert(hotelLookup !== null, `${route}: no nav entry for role ${role}`);
      assertEqual(hotelLookup?.item.href, route, `${route}: nav href mismatch`);
    }
    const adminLookup = findNavItemByPath(internalAdminNavigationConfig, "/admin");
    assert(adminLookup?.item.href === "/admin", "/admin missing from platform nav config");
  });

  await runTest("6. Navigation config: dashboard moved to /dashboard", () => {
    const lookup = findNavItemByPath(hotelNavigationConfig, "/dashboard");
    assert(lookup?.item.id === "dashboard", "dashboard nav item not at /dashboard");
    const anyRootHref = hotelNavigationConfig.sections
      .flatMap((section) => section.items)
      .some((item) => item.href === "/");
    assert(!anyRootHref, "no hotel nav item should own the root route (landing page does)");
  });

  // ── 2. Role → panel routing & route protection ──────────────────────────
  await runTest("7. Every demo role can open its own panel route", () => {
    for (const user of DEMO_USERS) {
      const session = createDemoSession(user);
      const target = getLoginRedirectPath(session, null);
      assertEqual(target, getPanelRoute(user.role), `${user.id}: login redirect`);
      assert(
        canAccessDemoRoute(user.role, target),
        `${user.id}: cannot open own panel ${target}`,
      );
      clearDemoSession();
    }
  });

  await runTest("8. Platform super admin is scoped to /admin only", () => {
    assert(canAccessDemoRoute("platform_super_admin", "/admin"), "/admin blocked");
    assert(canAccessDemoRoute("platform_super_admin", "/admin/hotels"), "/admin/hotels blocked");
    assert(!canAccessDemoRoute("platform_super_admin", "/dashboard"), "/dashboard must be blocked");
    assert(!canAccessDemoRoute("platform_super_admin", "/manager"), "/manager must be blocked");
    assert(!canAccessDemoRoute("platform_super_admin", "/bookings"), "/bookings must be blocked");
  });

  await runTest("9. Hotel roles can never open /admin", () => {
    for (const role of ALL_ROLES) {
      if (role === "platform_super_admin") continue;
      assert(!canAccessDemoRoute(role, "/admin"), `${role} must be blocked from /admin`);
      assert(!canAccessDemoRoute(role, "/admin/hotels"), `${role} must be blocked from /admin/hotels`);
    }
  });

  await runTest("10. Manager: /manager + own modules allowed, /finance + /admin blocked", () => {
    assert(canAccessDemoRoute("manager", "/manager"), "/manager blocked");
    assert(canAccessDemoRoute("manager", "/dashboard"), "/dashboard blocked");
    assert(canAccessDemoRoute("manager", "/bookings"), "/bookings blocked");
    assert(canAccessDemoRoute("manager", "/bookings/new"), "/bookings/new blocked");
    assert(!canAccessDemoRoute("manager", "/finance"), "/finance must be blocked");
    assert(!canAccessDemoRoute("manager", "/reception"), "/reception must be blocked");
    assert(!canAccessDemoRoute("manager", "/admin"), "/admin must be blocked");
  });

  await runTest("11. Receptionist: desk routes allowed, finance/settings blocked", () => {
    assert(canAccessDemoRoute("receptionist", "/reception"), "/reception blocked");
    assert(canAccessDemoRoute("receptionist", "/reception/arrivals"), "/reception/arrivals blocked");
    assert(canAccessDemoRoute("receptionist", "/guests"), "/guests blocked");
    assert(!canAccessDemoRoute("receptionist", "/finance"), "/finance must be blocked");
    assert(!canAccessDemoRoute("receptionist", "/settings/media"), "/settings/media must be blocked");
    assert(!canAccessDemoRoute("receptionist", "/manager"), "/manager must be blocked");
  });

  await runTest("12. Security panel: security + owner only", () => {
    assert(canAccessDemoRoute("security", "/security"), "/security blocked");
    assert(canAccessDemoRoute("hotel_super_admin", "/security"), "owner blocked from /security");
    assert(!canAccessDemoRoute("manager", "/security"), "manager must be blocked from /security");
    assert(!canAccessDemoRoute("receptionist", "/security"), "receptionist must be blocked");
  });

  await runTest("13. Manager panel: manager + owner only", () => {
    assert(canAccessDemoRoute("manager", "/manager"), "/manager blocked");
    assert(canAccessDemoRoute("hotel_super_admin", "/manager"), "owner blocked from /manager");
    assert(!canAccessDemoRoute("receptionist", "/manager"), "receptionist must be blocked");
    assert(!canAccessDemoRoute("finance", "/manager"), "finance must be blocked");
  });

  await runTest("14. Public routes open for every role", () => {
    for (const role of ALL_ROLES) {
      for (const route of PUBLIC_DEMO_ROUTES) {
        assert(canAccessDemoRoute(role, route), `${role} blocked from public ${route}`);
      }
    }
  });

  await runTest("15. Unknown paths resolve to no hotel module (404 before guard)", () => {
    assert(!canRoleAccessHotelPath("manager", "/definitely-not-a-route"), "unknown path must fail");
    assertEqual(findNavItemByPath(hotelNavigationConfig, "/definitely-not-a-route"), null, "nav lookup");
  });

  // ── 3. Demo session ─────────────────────────────────────────────────────
  await runTest("16. Session stores only allowlisted non-sensitive fields", () => {
    const owner = getDemoUser("demo-owner");
    assert(owner !== null, "demo-owner missing");
    const session = createDemoSession(owner!);
    const keys = Object.keys(session).sort();
    for (const key of keys) {
      assert(
        ["uid", "role", "name", "hotelId", "branchIds"].includes(key),
        `unexpected session field: ${key}`,
      );
    }
    const raw = window.localStorage.getItem(STORAGE_KEY) ?? "";
    for (const forbidden of ["password", "token", "secret", "otp", "apiKey"]) {
      assert(!raw.toLowerCase().includes(forbidden), `session must not contain ${forbidden}`);
    }
    assertEqual(session.hotelId, "hotel-01", "hotelId");
    assertEqual(session.branchIds.length, 3, "owner branchIds");
    clearDemoSession();
  });

  await runTest("17. Platform session carries no hotel scope", () => {
    const platform = getDemoUser("demo-super-admin");
    const session = createDemoSession(platform!);
    assert(!("hotelId" in session), "platform session must not include hotelId");
    assertEqual(session.role, "platform_super_admin", "role");
    clearDemoSession();
  });

  await runTest("18. Session persists (refresh) and clears on logout", () => {
    const manager = getDemoUser("demo-manager");
    createDemoSession(manager!);
    const reread = getDemoSession(); // simulated fresh read after reload
    assert(reread !== null, "session lost after re-read");
    assertEqual(reread!.uid, "demo-manager", "uid after re-read");
    clearDemoSession();
    assertEqual(getDemoSession(), null, "session after clear");
    assertEqual(window.localStorage.getItem(STORAGE_KEY), null, "storage after clear");
  });

  await runTest("19. Corrupt session data is rejected safely", () => {
    window.localStorage.setItem(STORAGE_KEY, "not-json{{{");
    assertEqual(getDemoSession(), null, "corrupt json");
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ uid: "", role: "boss" }));
    assertEqual(getDemoSession(), null, "invalid structure");
    clearDemoSession();
  });

  await runTest("20. Stale session uid resolves to null profile (guard clears it)", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ uid: "ghost-user", role: "manager", name: "Ghost", branchIds: [] }),
    );
    const session = getDemoSession();
    assert(session !== null, "structure valid");
    assertEqual(resolveDemoUser(session), null, "stale resolveDemoUser");
    assertEqual(getDemoUserProfile(session), null, "stale profile");
    clearDemoSession();
  });

  await runTest("21. Profile derived from session includes identity + scope", () => {
    const receptionist = getDemoUser("demo-reception");
    const session = createDemoSession(receptionist!);
    const profile = getDemoUserProfile(session);
    assert(profile !== null, "profile missing");
    assertEqual(profile!.email, "reception@demo.local", "email");
    assertEqual(profile!.roleName, "Receptionist", "roleName");
    assertEqual(profile!.isPlatformAdmin, false, "isPlatformAdmin");
    assertEqual(profile!.assignedBranchIds, ["branch-01"], "assignedBranchIds");
    clearDemoSession();
  });

  await runTest("22. Login redirect: next honored only when role may open it", () => {
    const manager = getDemoUser("demo-manager")!;
    const managerSession = createDemoSession(manager);
    assertEqual(getLoginRedirectPath(managerSession, null), "/manager", "default panel");
    assertEqual(getLoginRedirectPath(managerSession, "/bookings"), "/bookings", "valid next");
    assertEqual(getLoginRedirectPath(managerSession, "/admin"), "/manager", "cross-role next");
    assertEqual(getLoginRedirectPath(managerSession, "//evil.com"), "/manager", "open redirect");
    clearDemoSession();

    const platform = getDemoUser("demo-super-admin")!;
    const platformSession = createDemoSession(platform);
    assertEqual(getLoginRedirectPath(platformSession, "/admin"), "/admin", "platform next");
    clearDemoSession();
  });

  // ── 4. Module access ────────────────────────────────────────────────────
  await runTest("23. Effective modules = role grants ∩ hotel plan", () => {
    assertEqual(
      getEffectiveModules("hotel_super_admin", "hotel-01").length,
      ROLE_MODULES.hotel_super_admin.length,
      "owner@hotel-01 all modules",
    );
    assertEqual(
      getEffectiveModules("manager", "hotel-03"),
      ["dashboard", "bookings", "rooms", "guests", "housekeeping"],
      "manager@hotel-03 boutique intersection (staff/reports excluded)",
    );
    const financeAtMeridian = getEffectiveModules("finance", "hotel-02");
    assert(financeAtMeridian.includes("finance"), "finance module missing at hotel-02");
    assert(financeAtMeridian.includes("reports"), "reports module missing at hotel-02");
    assertEqual(getEffectiveModules("platform_super_admin", undefined), [], "platform modules");
    for (const hotelId of Object.keys(HOTEL_MODULE_PRESETS)) {
      assert(
        getEffectiveModules("receptionist", hotelId).includes("dashboard"),
        `dashboard missing for receptionist@${hotelId}`,
      );
    }
  });

  await runTest("24. Manager sidebar: spec modules visible, finance/restaurant hidden", () => {
    const titles = topLevelNavTitles(getEffectiveModules("manager", "hotel-01"));
    for (const expected of [
      "Dashboard",
      "Bookings",
      "Guest Directory",
      "Rooms & Units",
      "Housekeeping",
      "Staff & Shifts",
      "Reports & ADR",
    ]) {
      assert(titles.includes(expected), `sidebar missing: ${expected}`);
    }
    for (const blocked of ["Billing & Finance", "Restaurant & POS", "Reception & Desk"]) {
      assert(!titles.includes(blocked), `sidebar must hide: ${blocked}`);
    }
  });

  await runTest("25. Receptionist sidebar: desk routes visible, maintenance hidden", () => {
    const titles = topLevelNavTitles(getEffectiveModules("receptionist", "hotel-01"));
    for (const expected of ["Dashboard", "Bookings", "Reception & Desk", "Guest Directory", "Rooms & Units"]) {
      assert(titles.includes(expected), `sidebar missing: ${expected}`);
    }
    for (const blocked of ["Maintenance", "Billing & Finance", "Inventory & Stock"]) {
      assert(!titles.includes(blocked), `sidebar must hide: ${blocked}`);
    }
  });

  await runTest("26. Configuration-driven access: boutique hotel hides staff/reports", () => {
    const titles = topLevelNavTitles(getEffectiveModules("manager", "hotel-03"));
    assert(!titles.includes("Staff & Shifts"), "staff hidden by hotel-03 plan");
    assert(!titles.includes("Reports & ADR"), "reports hidden by hotel-03 plan");
    assert(titles.includes("Housekeeping"), "housekeeping visible");
  });

  // ── 5. Structural wiring (pages + guards) ───────────────────────────────
  await runTest("27. Required pages exist (landing, login, panels)", () => {
    for (const file of [
      "app/page.tsx",
      "app/login/page.tsx",
      "app/dashboard/page.tsx",
      "app/manager/page.tsx",
      "app/security/page.tsx",
      "app/admin/page.tsx",
    ]) {
      assert(appFileExists(file), `missing page: ${file}`);
    }
  });

  await runTest("28. All protected routes are wrapped in DemoRouteGuard", () => {
    for (const file of [
      "app/dashboard/page.tsx",
      "app/manager/page.tsx",
      "app/security/page.tsx",
      "app/admin/page.tsx",
      "app/settings/media/page.tsx",
      "app/[...slug]/page.tsx",
    ]) {
      const source = fs.readFileSync(path.join(process.cwd(), file), "utf8");
      assert(source.includes("DemoRouteGuard"), `${file} missing DemoRouteGuard`);
    }
    const landing = fs.readFileSync(path.join(process.cwd(), "app/page.tsx"), "utf8");
    assert(!landing.includes("DemoRouteGuard"), "landing page must stay public");
    const login = fs.readFileSync(path.join(process.cwd(), "app/login/page.tsx"), "utf8");
    assert(!login.includes("DemoRouteGuard"), "login page must stay public");
  });

  await runTest("29. No real auth tech introduced (demo-only guardrails)", () => {
    const banned = ["nodemailer", "jsonwebtoken", "bcrypt", "next-auth", "passport"];
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const dep of banned) {
      assert(!(dep in allDeps), `banned auth dependency present: ${dep}`);
    }
  });

  await runTest("30. Demo session isolation: lib/demo module exists and is centralized", () => {
    assert(appFileExists("lib/demo/demo-session.ts"), "session module missing");
    assert(appFileExists("config/demo.ts"), "demo config missing");
    const config = fs.readFileSync(path.join(process.cwd(), "config/demo.ts"), "utf8");
    assert(config.includes("DEMO_USERS"), "centralized demo users missing");
    assert(config.includes("ROLE_PANELS"), "centralized role panels missing");
    // Demo credentials must not be scattered across components.
    for (const file of fs.readdirSync(path.join(process.cwd(), "components/demo"))) {
      const source = fs.readFileSync(path.join(process.cwd(), "components/demo", file), "utf8");
      for (const demoUser of DEMO_USERS) {
        assert(
          !source.includes(demoUser.email),
          `demo credential ${demoUser.email} leaked into components/demo/${file}`,
        );
      }
    }
  });

  // ── Summary ─────────────────────────────────────────────────────────────
  const passed = results.filter((result) => result.passed).length;
  const failed = results.length - passed;
  console.log(`\n${passed}/${results.length} passed, ${failed} failed`);
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
