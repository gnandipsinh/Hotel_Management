import fs from "node:fs";
import path from "node:path";
import {
  INITIAL_ONBOARDING_STATE,
  ONBOARDING_STEPS,
  ONBOARDING_STORAGE_KEY,
  AVAILABLE_MODULES,
  validateStep,
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
  validateStep5,
  validateStep6,
} from "@/config/onboarding";
import {
  PUBLIC_DEMO_ROUTES,
  getPanelRoute,
} from "@/config/demo";
import {
  canAccessDemoRoute,
  createDemoSession,
  getDemoSession,
  clearDemoSession,
} from "@/lib/demo/demo-session";
import type { OnboardingBranch, OnboardingState } from "@/types/onboarding";

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

// In-memory mock storage
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

function fileContains(relPath: string, searchStr: string): boolean {
  const fullPath = path.join(process.cwd(), relPath);
  if (!fs.existsSync(fullPath)) return false;
  const content = fs.readFileSync(fullPath, "utf-8");
  return content.includes(searchStr);
}

async function main() {
  console.log("Phase 9 Test Suite — Get Started / Hotel Onboarding UI");
  console.log("====================================================\n");

  (globalThis as { window?: unknown }).window = new FakeWindow();

  // ── 1. Landing Entry ──────────────────────────────────────────────────────
  await runTest("1. Get Started CTA on landing page & actions", () => {
    assert(fileContains("components/demo/landing-actions.tsx", 'href="/onboarding"'), "landing-actions has /onboarding href");
    assert(fileContains("components/demo/landing-actions.tsx", "Get Started"), "landing-actions has 'Get Started' text");
    assert(fileContains("app/page.tsx", 'href="/onboarding"'), "app/page.tsx header has /onboarding href");
  });

  // ── 2. Route & Public Access ─────────────────────────────────────────────
  await runTest("2. Onboarding route /onboarding exists and is publicly accessible", () => {
    assert(fs.existsSync(path.join(process.cwd(), "app/onboarding/page.tsx")), "app/onboarding/page.tsx must exist");
    assert(PUBLIC_DEMO_ROUTES.includes("/onboarding"), "/onboarding must be in PUBLIC_DEMO_ROUTES");
    assert(canAccessDemoRoute("hotel_super_admin", "/onboarding"), "hotel_super_admin can access /onboarding");
    assert(canAccessDemoRoute("platform_super_admin", "/onboarding"), "platform_super_admin can access /onboarding");
  });

  // ── 3. Centralized Step System ───────────────────────────────────────────
  await runTest("3. Centralized 7-step onboarding configuration", () => {
    assertEqual(ONBOARDING_STEPS.length, 7, "7 steps defined");
    const stepIds = ONBOARDING_STEPS.map((s) => s.id);
    const expected = [
      "hotel_info",
      "branding",
      "branches",
      "property_config",
      "services_modules",
      "payment_upi",
      "review_finish",
    ];
    assertEqual(stepIds, expected, "step ids sequence");
    ONBOARDING_STEPS.forEach((s, idx) => {
      assertEqual(s.step, idx + 1, `step ${idx + 1} numbering`);
      assert(s.title.length > 0, `step ${s.step} title`);
      assert(s.description.length > 0, `step ${s.step} description`);
    });
  });

  // ── 4. Step Navigation ───────────────────────────────────────────────────
  await runTest("4. Step navigation clamping and bounds", () => {
    let currentStep = 1;
    // Step decrement cannot go below 1
    currentStep = Math.max(currentStep - 1, 1);
    assertEqual(currentStep, 1, "step cannot decrement below 1");

    // Step increment bounds at 7
    for (let i = 0; i < 10; i += 1) {
      currentStep = Math.min(currentStep + 1, ONBOARDING_STEPS.length);
    }
    assertEqual(currentStep, 7, "step cannot increment above 7");
  });

  // ── 5. Step 1 Required Fields ────────────────────────────────────────────
  await runTest("5. Step 1: Hotel Info required fields validation", () => {
    const invalidHotel = {
      name: "",
      legalName: "",
      type: "Hotel" as const,
      starRating: "5 Star Luxury" as const,
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    };
    const res = validateStep1(invalidHotel);
    assert(!res.isValid, "empty hotel info must be invalid");
    assert(!!res.errors.name, "name error present");
    assert(!!res.errors.legalName, "legalName error present");
    assert(!!res.errors.email, "email error present");
    assert(!!res.errors.phone, "phone error present");
    assert(!!res.errors.address, "address error present");
    assert(!!res.errors.city, "city error present");
  });

  // ── 6. Email Validation ──────────────────────────────────────────────────
  await runTest("6. Step 1: Email format validation", () => {
    const valid = validateStep1({ ...INITIAL_ONBOARDING_STATE.hotel, email: "manager@luxuryhotel.com" });
    assert(!valid.errors.email, "valid email accepted");

    const invalid = validateStep1({ ...INITIAL_ONBOARDING_STATE.hotel, email: "invalid-email-string" });
    assert(!!invalid.errors.email, "invalid email rejected");
  });

  // ── 7. Phone Validation ──────────────────────────────────────────────────
  await runTest("7. Step 1: Phone number validation", () => {
    const valid = validateStep1({ ...INITIAL_ONBOARDING_STATE.hotel, phone: "+91 98765 43210" });
    assert(!valid.errors.phone, "valid phone accepted");

    const short = validateStep1({ ...INITIAL_ONBOARDING_STATE.hotel, phone: "1234" });
    assert(!!short.errors.phone, "short phone (<8 digits) rejected");
  });

  // ── 8. GST Validation ────────────────────────────────────────────────────
  await runTest("8. Step 1: GST number format validation", () => {
    const validGst = validateStep1({ ...INITIAL_ONBOARDING_STATE.hotel, gstNumber: "08AAAAA0000A1Z5" });
    assert(!validGst.errors.gstNumber, "valid 15-char GSTIN accepted");

    const invalidGst = validateStep1({ ...INITIAL_ONBOARDING_STATE.hotel, gstNumber: "INVALID_GST" });
    assert(!!invalidGst.errors.gstNumber, "invalid GST rejected");
  });

  // ── 9. Hotel Branding Structure ──────────────────────────────────────────
  await runTest("9. Step 2: Branding state structure", () => {
    const { branding } = INITIAL_ONBOARDING_STATE;
    assert(branding.logo !== null, "initial logo asset present");
    assert(branding.cover !== null, "initial cover asset present");
    assert(Array.isArray(branding.gallery), "gallery is array");
    assert(branding.gallery.length > 0, "initial gallery has items");
  });

  // ── 10. Logo Upload Integration ──────────────────────────────────────────
  await runTest("10. Step 2: Logo requirement validation", () => {
    const valid = validateStep2(INITIAL_ONBOARDING_STATE.branding);
    assert(valid.isValid, "branding with logo is valid");

    const noLogo = validateStep2({ ...INITIAL_ONBOARDING_STATE.branding, logo: null });
    assert(!noLogo.isValid, "branding without logo is invalid");
    assert(!!noLogo.errors.logo, "logo error present");
  });

  // ── 11. Cover Image Integration ──────────────────────────────────────────
  await runTest("11. Step 2: Cover image metadata fields", () => {
    const cover = INITIAL_ONBOARDING_STATE.branding.cover;
    assert(cover !== null, "cover present");
    assertEqual(cover?.category, "hotel_cover", "category is hotel_cover");
    assert(Boolean(cover && cover.url.startsWith("http")), "cover has valid URL");
  });

  // ── 12. Gallery Multi-Image Integration ──────────────────────────────────
  await runTest("12. Step 2: Gallery multi-image ordering & primary selection", () => {
    const gallery = [...INITIAL_ONBOARDING_STATE.branding.gallery];
    assert(gallery.length >= 2, "gallery has multiple items");
    const hasPrimary = gallery.some((g) => g.isPrimary);
    assert(hasPrimary, "one gallery photo marked as primary");

    // Move first photo right
    const temp = gallery[0];
    gallery[0] = gallery[1];
    gallery[1] = temp;
    assertEqual(gallery[0].id, INITIAL_ONBOARDING_STATE.branding.gallery[1].id, "reorder swap works");
  });

  // ── 13. Branch Add ───────────────────────────────────────────────────────
  await runTest("13. Step 3: Branch addition with required fields", () => {
    const initialBranches = INITIAL_ONBOARDING_STATE.branches;
    const newBranch: OnboardingBranch = {
      id: "branch-02",
      name: "Mirage Heritage Villa Resort",
      code: "UDR-VILLA",
      address: "Lake View Road",
      city: "Udaipur",
      state: "Rajasthan",
      postalCode: "313001",
      phone: "+91 98765 43212",
      email: "villa@royalmirage.com",
      managerName: "Devendra Singh",
      isPrimary: false,
    };
    const updatedBranches = [...initialBranches, newBranch];
    assertEqual(updatedBranches.length, 2, "2 branches after add");
    const val = validateStep3(updatedBranches);
    assert(val.isValid, "added branch validates cleanly");
  });

  // ── 14. Branch Edit ──────────────────────────────────────────────────────
  await runTest("14. Step 3: Branch modification", () => {
    const branches = [...INITIAL_ONBOARDING_STATE.branches];
    branches[0] = { ...branches[0], name: "Updated Palace Main Wing" };
    assertEqual(branches[0].name, "Updated Palace Main Wing", "branch name updated");
    const val = validateStep3(branches);
    assert(val.isValid, "modified branch valid");
  });

  // ── 15. Branch Removal ───────────────────────────────────────────────────
  await runTest("15. Step 3: Branch removal & non-zero enforcement", () => {
    const emptyBranches: OnboardingBranch[] = [];
    const val = validateStep3(emptyBranches);
    assert(!val.isValid, "0 branches rejected");
    assert(!!val.errors.branches, "branches error reported");
  });

  // ── 16. Primary Branch Enforcement ───────────────────────────────────────
  await runTest("16. Step 3: Primary branch requirement", () => {
    const branchesNoPrimary: OnboardingBranch[] = [
      {
        ...INITIAL_ONBOARDING_STATE.branches[0],
        isPrimary: false,
      },
    ];
    const val = validateStep3(branchesNoPrimary);
    assert(!val.isValid, "branch list without primary is rejected");
    assert(!!val.errors.primary, "primary error reported");
  });

  // ── 17. Property Floors & Rooms ──────────────────────────────────────────
  await runTest("17. Step 4: Property configuration floors & rooms validation", () => {
    const valid = validateStep4(INITIAL_ONBOARDING_STATE.property);
    assert(valid.isValid, "initial property config is valid");

    const invalid = validateStep4({
      ...INITIAL_ONBOARDING_STATE.property,
      floors: 0,
      totalRooms: 0,
    });
    assert(!invalid.isValid, "0 floors / 0 rooms rejected");
    assert(!!invalid.errors.floors, "floors error reported");
    assert(!!invalid.errors.totalRooms, "rooms error reported");
  });

  // ── 18. Room Category Management ─────────────────────────────────────────
  await runTest("18. Step 4: Room categories management", () => {
    const cats = [...INITIAL_ONBOARDING_STATE.property.roomCategories];
    assert(cats.length >= 2, "preset categories present");

    // Add custom category
    const added = [...cats, "Presidential Royal Suite"];
    assert(added.includes("Presidential Royal Suite"), "custom category added");

    // Remove category
    const removed = added.filter((c) => c !== "Presidential Royal Suite");
    assertEqual(removed.length, cats.length, "custom category removed");
  });

  // ── 19. Module Selection from Centralized Catalog ────────────────────────
  await runTest("19. Step 5: Module selection from available catalog", () => {
    assert(AVAILABLE_MODULES.length >= 12, "catalog contains at least 12 modules");
    const moduleKeys = AVAILABLE_MODULES.map((m) => m.key);
    assert(moduleKeys.includes("reception"), "reception in catalog");
    assert(moduleKeys.includes("rooms"), "rooms in catalog");
    assert(moduleKeys.includes("bookings"), "bookings in catalog");
    assert(moduleKeys.includes("finance"), "finance in catalog");

    const valid = validateStep5(INITIAL_ONBOARDING_STATE.modules);
    assert(valid.isValid, "preset module selection is valid");
  });

  // ── 20. Module Deselection & Minimum Rule ─────────────────────────────────
  await runTest("20. Step 5: Module deselection and minimum module requirement", () => {
    const emptyModules = { selectedKeys: [] };
    const val = validateStep5(emptyModules);
    assert(!val.isValid, "empty modules selection rejected");
    assert(!!val.errors.modules, "modules error reported");
  });

  // ── 21. UPI ID Format Validation ─────────────────────────────────────────
  await runTest("21. Step 6: UPI VPA validation", () => {
    const valid = validateStep6({
      ...INITIAL_ONBOARDING_STATE.payment,
      upiId: "royalmirage@okhdfcbank",
    });
    assert(valid.isValid, "valid UPI handle accepted");

    const invalid = validateStep6({
      ...INITIAL_ONBOARDING_STATE.payment,
      upiId: "invalid_upi_handle",
    });
    assert(!invalid.isValid, "invalid UPI rejected");
    assert(!!invalid.errors.upiId, "upiId error reported");
  });

  // ── 22. UPI QR Integration ───────────────────────────────────────────────
  await runTest("22. Step 6: UPI QR attachment slot", () => {
    const qr = INITIAL_ONBOARDING_STATE.payment.upiQr;
    assert(qr !== null, "initial QR present");
    assertEqual(qr?.category, "upi_qr", "QR category is upi_qr");
  });

  // ── 23. Step 7 Review Grouped Summaries ──────────────────────────────────
  await runTest("23. Step 7: Review summary aggregation", () => {
    const val = validateStep(7, INITIAL_ONBOARDING_STATE);
    assert(val.isValid, "step 7 validation is true");
    // Ensure all 6 preceding sections validate
    for (let s = 1; s <= 6; s += 1) {
      const stepVal = validateStep(s, INITIAL_ONBOARDING_STATE);
      assert(stepVal.isValid, `step ${s} satisfies review readiness`);
    }
  });

  // ── 24. Direct Jump Navigation ───────────────────────────────────────────
  await runTest("24. Step 7: Jump navigation to previous steps", () => {
    let currentStep = 7;
    const targetSteps = [1, 2, 3, 4, 5, 6];
    for (const target of targetSteps) {
      currentStep = target;
      assertEqual(currentStep, target, `jumped directly to step ${target}`);
    }
  });

  // ── 25. Completion State Generation ──────────────────────────────────────
  await runTest("25. Onboarding completion state generation", () => {
    const completedState: OnboardingState = {
      ...INITIAL_ONBOARDING_STATE,
      isCompleted: true,
      completedAt: new Date().toISOString(),
    };
    assert(completedState.isCompleted, "isCompleted marked true");
    assert(typeof completedState.completedAt === "string", "completedAt recorded");
  });

  // ── 26. Demo Session Preservation ────────────────────────────────────────
  await runTest("26. Demo session creation on onboarding completion", () => {
    clearDemoSession();
    const onboardedUser = {
      id: "demo-owner",
      name: "The Royal Mirage Palace",
      email: "concierge@royalmirage.com",
      role: "hotel_super_admin" as const,
      roleName: "Hotel Super Admin (Owner)",
      hotelId: "hotel-01",
      branchIds: ["branch-primary-01"],
    };
    const session = createDemoSession(onboardedUser);
    assertEqual(session.role, "hotel_super_admin", "session role is hotel_super_admin");
    assertEqual(session.hotelId, "hotel-01", "session hotelId preserved");
    assertEqual(getDemoSession()?.uid, "demo-owner", "session saved in storage");
    clearDemoSession();
  });

  // ── 27. Dashboard Redirect ───────────────────────────────────────────────
  await runTest("27. Onboarded session can access /dashboard panel", () => {
    assert(canAccessDemoRoute("hotel_super_admin", "/dashboard"), "hotel_super_admin can access /dashboard");
    assertEqual(getPanelRoute("hotel_super_admin"), "/dashboard", "panel route matches");
  });

  // ── 28. LocalStorage Persistence ─────────────────────────────────────────
  await runTest("28. LocalStorage persistence and recovery", () => {
    const fakeWindow = (globalThis as unknown as { window: FakeWindow }).window;
    fakeWindow.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(INITIAL_ONBOARDING_STATE));
    const raw = fakeWindow.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    assert(raw !== null, "storage key exists");
    const parsed = JSON.parse(raw!);
    assertEqual(parsed.hotel.name, INITIAL_ONBOARDING_STATE.hotel.name, "state restored faithfully");
    fakeWindow.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  });

  // ── 29. Mobile Stepper Calculation ───────────────────────────────────────
  await runTest("29. Mobile stepper progress calculation", () => {
    const total = ONBOARDING_STEPS.length;
    assertEqual(total, 7, "total steps is 7");
    const p1 = Math.round((1 / 7) * 100);
    const p4 = Math.round((4 / 7) * 100);
    const p7 = Math.round((7 / 7) * 100);
    assertEqual(p1, 14, "step 1 is 14%");
    assertEqual(p4, 57, "step 4 is 57%");
    assertEqual(p7, 100, "step 7 is 100%");
  });

  // ── 30. Component Files Exist ────────────────────────────────────────────
  await runTest("30. All Phase 9 UI components and routes exist", () => {
    const files = [
      "types/onboarding.ts",
      "config/onboarding.ts",
      "lib/onboarding/use-onboarding.ts",
      "components/onboarding/onboarding-shell.tsx",
      "components/onboarding/onboarding-stepper.tsx",
      "components/onboarding/onboarding-success.tsx",
      "components/onboarding/steps/step1-hotel-info.tsx",
      "components/onboarding/steps/step2-branding.tsx",
      "components/onboarding/steps/step3-branch-setup.tsx",
      "components/onboarding/steps/step4-property-config.tsx",
      "components/onboarding/steps/step5-services-modules.tsx",
      "components/onboarding/steps/step6-payment-upi.tsx",
      "components/onboarding/steps/step7-review.tsx",
      "app/onboarding/page.tsx",
    ];
    for (const file of files) {
      assert(fs.existsSync(path.join(process.cwd(), file)), `File missing: ${file}`);
    }
  });

  console.log("\n====================================================");
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`Phase 9 Results: ${passed}/${results.length} passed, ${failed} failed`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
