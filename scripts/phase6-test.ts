import "dotenv/config";
import { connectDB, disconnectDB } from "@/lib/db/mongoose";
import { Hotel } from "@/models/Hotel";
import { Branch } from "@/models/Branch";
import { Module } from "@/models/Module";
import { Permission } from "@/models/Permission";
import { Role } from "@/models/Role";
import { HotelModule } from "@/models/HotelModule";
import { createHotel, getHotels, getHotelById } from "@/services/hotel/hotelService";
import { createBranch, getBranches, getBranchById } from "@/services/branch/branchService";
import { listModuleCatalog, getHotelModules, assignHotelModule } from "@/services/module/moduleService";
import { runSeed } from "@/services/seed/seedService";
import { assertObjectId } from "@/lib/db/validate";
import mongoose from "mongoose";

const TEST_DB_NAME = "hotel_saas_test";

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

interface TestError extends Error {
  statusCode?: number;
  code?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

async function runTest(name: string, fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log(`  ✅ ${name}`);
  } catch (e) {
    results.push({ name, passed: false, error: String(e) });
    console.log(`  ❌ ${name}: ${e}`);
  }
}

async function main() {
  console.log("🧪 Phase 6 Test Suite");
  console.log("=====================\n");

  process.env.MONGODB_DB_NAME = TEST_DB_NAME;

  await runTest("1. MongoDB connection", async () => {
    await connectDB();
    const admin = mongoose.connection.db?.admin();
    const ping = await admin?.command({ ping: 1 });
    assert(ping?.ok === 1, "Ping failed");
    assert(mongoose.connection.readyState === 1, "Not connected");
  });

  await runTest("2. Index verification", async () => {
    await Hotel.syncIndexes();
    await Branch.syncIndexes();
    await Module.syncIndexes();
    await Permission.syncIndexes();
    await Role.syncIndexes();
    await HotelModule.syncIndexes();

    const hotelIndexes = await Hotel.collection.listIndexes().toArray();
    const branchIndexes = await Branch.collection.listIndexes().toArray();
    const moduleIndexes = await Module.collection.listIndexes().toArray();
    const permissionIndexes = await Permission.collection.listIndexes().toArray();
    const roleIndexes = await Role.collection.listIndexes().toArray();
    const hotelModuleIndexes = await HotelModule.collection.listIndexes().toArray();

    const idxNames = (idxs: { name: string }[]) => idxs.map((i) => i.name);
    assert(idxNames(hotelIndexes).includes("slug_1"), "Hotel slug index missing");
    assert(idxNames(branchIndexes).includes("hotelId_1_code_1"), "Branch compound index missing");
    assert(idxNames(moduleIndexes).includes("key_1"), "Module key index missing");
    assert(idxNames(permissionIndexes).includes("key_1"), "Permission key index missing");
    assert(idxNames(roleIndexes).includes("hotelId_1_name_1"), "Role compound index missing");
    assert(idxNames(hotelModuleIndexes).includes("hotelId_1_moduleKey_1"), "HotelModule compound index missing");
  });

  await runTest("3. Seed idempotency (run 1)", async () => {
    const result = await runSeed();
    assert(result.modules.inserted === 13, `Expected 13 modules, got ${result.modules.inserted}`);
    assert(result.permissions.inserted > 0, "Permissions should be inserted");
    assert(result.roles.inserted === 8, `Expected 8 roles, got ${result.roles.inserted}`);
  });

  await runTest("4. Seed idempotency (run 2)", async () => {
    const result = await runSeed();
    assert(result.modules.inserted === 0, "Expected 0 modules on second run");
    assert(result.permissions.inserted === 0, "Expected 0 permissions on second run");
    assert(result.roles.inserted === 0, "Expected 0 roles on second run");
  });

  await runTest("5. Validation: invalid slug", async () => {
    try {
      await createHotel({
        name: "Test Hotel",
        email: "test@example.com",
        address: "123 Main St",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pincode: "400001",
        slug: "invalid slug!",
      });
      assert(false, "Should have thrown");
    } catch (caught) { const e = caught as TestError;
      assert(e.statusCode === 400, "Expected 400");
      assert(e.code === "INVALID_INPUT", "Expected INVALID_INPUT");
    }
  });

  await runTest("6. Validation: invalid email", async () => {
    try {
      await createHotel({
        name: "Test Hotel",
        email: "not-an-email",
        address: "123 Main St",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pincode: "400001",
      });
      assert(false, "Should have thrown");
    } catch (caught) { const e = caught as TestError;
      assert(e.statusCode === 400, "Expected 400");
    }
  });

  await runTest("7. Validation: missing required fields", async () => {
    try {
      await createHotel({
        name: "",
        email: "test@example.com",
        address: "123 Main St",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pincode: "400001",
      });
      assert(false, "Should have thrown");
    } catch (caught) { const e = caught as TestError;
      assert(e.statusCode === 400, "Expected 400");
    }
  });

  await runTest("8. Validation: invalid status enum", async () => {
    try {
      await createHotel({
        name: "Test Hotel",
        email: "test@example.com",
        address: "123 Main St",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pincode: "400001",
        status: "invalid" as unknown as "active",
      });
      assert(false, "Should have thrown");
    } catch (caught) { const e = caught as TestError;
      assert(e.statusCode === 400, "Expected 400");
    }
  });

  await runTest("9. Invalid ObjectId rejection", async () => {
    try {
      assertObjectId("not-an-id", "hotelId");
      assert(false, "Should have thrown");
    } catch (caught) { const e = caught as TestError;
      assert(e.statusCode === 400, "Expected 400");
      assert(e.code === "INVALID_INPUT", "Expected INVALID_INPUT code");
      assert(e.message.includes("hotelId"), "Expected field name in message");
    }
  });

  let hotel1: { id: string; slug: string } | null = null;
  await runTest("10a. Hotel create", async () => {
    const h = await createHotel({
      name: "E2E Test Hotel",
      email: "e2e1@test.com",
      address: "123 Main St",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      pincode: "400001",
    });
    assert(h.id.length > 0, "Hotel should have an id");
    hotel1 = { id: h.id, slug: h.slug };
  });

  await runTest("10b. Duplicate hotel slug → 409", async () => {
    if (!hotel1) throw new Error("hotel1 not set");
    try {
      await createHotel({
        name: "Another Hotel",
        email: "e2e2@test.com",
        address: "456 Other St",
        city: "Delhi",
        state: "Delhi",
        country: "India",
        pincode: "110001",
        slug: hotel1.slug,
      });
      assert(false, "Should have thrown");
    } catch (caught) { const e = caught as TestError;
      assert(e.statusCode === 409, "Expected 409 conflict");
    }
  });

  await runTest("11. Hotel retrieval", async () => {
    if (!hotel1) throw new Error("hotel1 not set");
    const list = await getHotels({ page: 1, limit: 10, skip: 0, sort: { createdAt: -1 }, search: "" });
    assert(list.items.length >= 1, "Should have at least 1 hotel");
    const byId = await getHotelById(hotel1.id);
    assert(byId.id === hotel1.id, "Should match");
  });

  let branch1: { id: string; hotelId: string } | null = null;
  await runTest("12a. Branch create", async () => {
    if (!hotel1) throw new Error("hotel1 not set");
    const b = await createBranch({
      hotelId: hotel1.id,
      name: "Main Branch",
      code: "MB01",
      address: "123 Main St",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      pincode: "400001",
    });
    assert(b.id.length > 0, "Branch should have an id");
    branch1 = { id: b.id, hotelId: b.hotelId };
  });

  await runTest("12b. Duplicate branch code → 409", async () => {
    if (!hotel1) throw new Error("hotel1 not set");
    try {
      await createBranch({
        hotelId: hotel1.id,
        name: "Second Branch",
        code: "MB01",
        address: "789 Other St",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pincode: "400001",
      });
      assert(false, "Should have thrown");
    } catch (caught) { const e = caught as TestError;
      assert(e.statusCode === 409, "Expected 409 conflict");
    }
  });

  await runTest("12c. Branch create with nonexistent hotel → 404", async () => {
    try {
      await createBranch({
        hotelId: new mongoose.Types.ObjectId().toString(),
        name: "Ghost Branch",
        code: "GB01",
        address: "Nowhere",
        city: "Void",
        state: "Null",
        country: "India",
        pincode: "000000",
      });
      assert(false, "Should have thrown");
    } catch (caught) { const e = caught as TestError;
      assert(e.statusCode === 404, "Expected 404 not found");
    }
  });

  await runTest("13. Branch retrieval + tenant filter", async () => {
    if (!hotel1 || !branch1) throw new Error("test data not set");
    const list = await getBranches({ hotelId: hotel1.id, page: 1, limit: 10, skip: 0, sort: { createdAt: -1 }, search: "" });
    assert(list.items.length >= 1, "Should have at least 1 branch");
    const byId = await getBranchById(branch1.id, hotel1.id);
    assert(byId.id === branch1.id, "Should match");

    try {
      await getBranchById(branch1.id, new mongoose.Types.ObjectId().toString());
      assert(false, "Should have thrown 404");
    } catch (caught) { const e = caught as TestError;
      assert(e.statusCode === 404 || e.message === "NOT_FOUND", "Should be 404 or NOT_FOUND");
    }
  });

  await runTest("14. Module catalog", async () => {
    const catalog = await listModuleCatalog({ page: 1, limit: 50, skip: 0, sort: { key: 1 }, search: "" });
    assert(catalog.items.length === 13, `Expected 13 modules, got ${catalog.items.length}`);
    assert(catalog.meta.total === 13, "Total should be 13");
  });

  await runTest("15a. Assign module to hotel", async () => {
    if (!hotel1) throw new Error("hotel1 not set");
    const assigned = await assignHotelModule(hotel1.id, "rooms");
    assert(assigned.moduleKey === "rooms", "Module key should be rooms");
    assert(assigned.enabled === true, "Enabled should be true");
  });

  await runTest("15b. Duplicate module assignment → 409", async () => {
    if (!hotel1) throw new Error("hotel1 not set");
    try {
      await assignHotelModule(hotel1.id, "rooms");
      assert(false, "Should have thrown");
    } catch (caught) { const e = caught as TestError;
      assert(e.statusCode === 409, "Expected 409 conflict");
    }
  });

  await runTest("15c. Get hotel modules", async () => {
    if (!hotel1) throw new Error("hotel1 not set");
    const mods = await getHotelModules(hotel1.id);
    assert(mods.items.length >= 1, "Should have at least 1 module");
    assert(mods.items.some((m) => m.moduleKey === "rooms"), "Should include rooms");
  });

  await runTest("16. Pagination & search", async () => {
    const r1 = await getHotels({ page: 1, limit: 999, skip: 0, sort: { createdAt: -1 }, search: "" });
    assert(r1.meta.limit === 100, "Limit should be clamped to 100");

    const r2 = await getHotels({ page: 1, limit: 20, skip: 0, sort: { createdAt: -1 }, search: "E2E" });
    assert(r2.items.every((h) => h.name.includes("E2E")), "All results should contain E2E");
  });

  await runTest("17. Error envelope & no leakage", async () => {
    if (!hotel1) throw new Error("hotel1 not set");
    try {
      await createHotel({
        name: "Test",
        email: "test@example.com",
        address: "123",
        city: "X",
        state: "Y",
        country: "Z",
        pincode: "1",
        slug: hotel1.slug,
      });
      assert(false, "Should have thrown");
    } catch (caught) { const e = caught as TestError;
      assert(e.statusCode === 409, "Expected 409");
      assert(!e.message.toLowerCase().includes("mongodb"), "Should not leak mongodb");
      assert(!e.message.toLowerCase().includes("stack"), "Should not leak stack");
    }
  });

  await runTest("18. Tenant filtering (withTenant)", async () => {
    const { withTenant } = await import("@/lib/db/tenant");
    const filter = withTenant({ status: "active" }, { hotelId: "abc123" });
    assert(filter.hotelId === "abc123", "hotelId should be set");
  });

  await runTest("Cleanup: drop test database", async () => {
    await mongoose.connection.dropDatabase();
    await disconnectDB();
  });

  console.log("\n=====================");
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);

  if (failed > 0) {
    console.log("\nFailures:");
    results.filter((r) => !r.passed).forEach((r) => console.log(`  - ${r.name}: ${r.error}`));
    process.exit(1);
  } else {
    console.log("\n🎉 All tests passed!");
  }
}

main().catch((e) => {
  console.error("Test runner crashed:", e);
  process.exit(1);
});
