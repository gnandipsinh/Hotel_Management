import "dotenv/config";
import { promises as fs } from "fs";
import path from "path";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "@/lib/db/mongoose";
import { Hotel } from "@/models/Hotel";
import { Branch } from "@/models/Branch";
import { FileAsset } from "@/models/FileAsset";
import { createHotel } from "@/services/hotel/hotelService";
import { createBranch } from "@/services/branch/branchService";
import {
  createFileAsset,
  listFiles,
  getFileAsset,
  patchFileAsset,
  deleteFileAsset,
  getFileForAccess,
  getFileBySignedKey,
} from "@/services/file/fileService";
import { validateFile } from "@/lib/storage/validate";
import { sniffMimeType, extractImageDimensions } from "@/lib/storage/file-signature";
import {
  buildStorageKey,
  isSafeStorageKey,
  sanitizeFileName,
} from "@/lib/storage/storage-path";
import { signStorageKey, verifyStorageKeySignature } from "@/lib/storage/signed";
import {
  getActiveProviderName,
  getStorageProvider,
  setStorageProvider,
} from "@/lib/storage/provider";
import { isCloudinaryConfigured } from "@/lib/storage/cloudinary-storage";
import type { StorageProvider } from "@/lib/storage/types";
import { validateFileClient } from "@/hooks/use-file-upload";
import { ApiError, jsonError, jsonOk } from "@/lib/db/errors";

const TEST_DB_NAME = "hotel_saas_test";
const STORAGE_ROOT = path.resolve(process.cwd(), "uploads-test");

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

async function runTest(name: string, fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log(`  [ok] ${name}`);
  } catch (e) {
    results.push({ name, passed: false, error: String(e) });
    console.log(`  [X] ${name}: ${e}`);
  }
}

function expectApiError(fn: () => Promise<unknown>): Promise<ApiError> {
  // `.then(fn)` converts synchronous throws into rejections as well.
  return Promise.resolve()
    .then(fn)
    .then(
      () => {
        throw new Error("Expected an ApiError but the call succeeded");
      },
      (caught: unknown) => {
        if (!(caught instanceof ApiError)) throw new Error(`Expected ApiError, got: ${caught}`);
        return caught;
      },
    );
}

// ---------------------------------------------------------------- fixtures
function makePng(width = 4, height = 3, seed = 1): Buffer {
  const buf = Buffer.alloc(64 + seed);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buf, 0);
  buf.writeUInt32BE(13, 8);
  buf.write("IHDR", 12, "ascii");
  buf.writeUInt32BE(width, 16);
  buf.writeUInt32BE(height, 20);
  buf.fill(seed & 0xff, 24);
  return buf;
}

function makeJpeg(seed = 2): Buffer {
  return Buffer.concat([
    Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
    Buffer.from([0x00, 0x10]),
    Buffer.from("JFIF\0", "ascii"),
    Buffer.alloc(9, seed & 0xff),
    Buffer.from([0xff, 0xd9]),
  ]);
}

function makeWebp(seed = 3): Buffer {
  const buf = Buffer.alloc(40, seed & 0xff);
  buf.write("RIFF", 0, "ascii");
  buf.writeUInt32LE(buf.length - 8, 4);
  buf.write("WEBP", 8, "ascii");
  return buf;
}

function makePdf(seed = 4): Buffer {
  return Buffer.from(
    `%PDF-1.4\n1 0 obj << /Type /Catalog >> endobj\n%%EOF\n%seed-${seed}\n`,
    "ascii",
  );
}

async function countStoredFiles(dir: string): Promise<number> {
  let total = 0;
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    if (entry.isDirectory()) {
      total += await countStoredFiles(path.join(dir, entry.name));
    } else {
      total += 1;
    }
  }
  return total;
}

async function main() {
  console.log("=== Phase 7: File & Image Storage Test Suite ===\n");

  // Environment: test DB, local storage, no cloud credentials.
  process.env.MONGODB_DB_NAME = TEST_DB_NAME;
  delete process.env.CLOUDINARY_CLOUD_NAME;
  delete process.env.CLOUDINARY_API_KEY;
  delete process.env.CLOUDINARY_API_SECRET;
  process.env.STORAGE_SIGNING_SECRET = "phase7-test-secret";
  process.env.LOCAL_STORAGE_DIR = STORAGE_ROOT;

  await fs.rm(STORAGE_ROOT, { recursive: true, force: true });
  await fs.mkdir(STORAGE_ROOT, { recursive: true });

  await connectDB();
  await mongoose.connection.dropDatabase();

  // Fixtures: two tenants (cross-tenant security matrix) + one branch each.
  const hotelA = await createHotel({
    name: "Phase7 Hotel A",
    email: "a-phase7@example.com",
    address: "1 Test Street",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pincode: "400001",
    slug: `p7-hotel-a-${Date.now().toString(36)}`,
  });
  const hotelB = await createHotel({
    name: "Phase7 Hotel B",
    email: "b-phase7@example.com",
    address: "2 Test Street",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    pincode: "411001",
    slug: `p7-hotel-b-${Date.now().toString(36)}`,
  });
  const branchA = await createBranch({
    hotelId: hotelA.id,
    name: "A Main",
    code: `AM${Date.now().toString(36).toUpperCase().slice(-5)}`,
    address: "1 Test Street",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pincode: "400001",
  });
  const branchB = await createBranch({
    hotelId: hotelB.id,
    name: "B Main",
    code: `BM${Date.now().toString(36).toUpperCase().slice(-5)}`,
    address: "2 Test Street",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    pincode: "411001",
  });
  const roomId = new mongoose.Types.ObjectId().toString();

  let logoId = "";
  let galleryOneId = "";
  let galleryTwoId = "";
  let privateDocId = "";
  let privateDocToken = "";

  // ------------------------------------------------------------- selection
  await runTest("1. Provider selection: local fallback when Cloudinary is not configured", async () => {
    assert(!isCloudinaryConfigured(), "Cloudinary must be unconfigured in this environment");
    assert(getActiveProviderName() === "local", "Expected the local provider");
    const provider = getStorageProvider();
    assert(provider.name === "local", `Unexpected provider ${provider.name}`);
  });

  await runTest("2. FileAsset indexes", async () => {
    await FileAsset.syncIndexes();
    const idx = await FileAsset.collection.listIndexes().toArray();
    const names = idx.map((i) => i.name);
    assert(names.includes("hotelId_1"), "hotelId index missing");
    assert(names.includes("hotelId_1_category_1"), "hotelId+category index missing");
    assert(
      names.includes("hotelId_1_entityType_1_entityId_1"),
      "hotelId+entity index missing",
    );
    assert(names.includes("createdAt_-1"), "createdAt index missing");
  });

  // ------------------------------------------------------------ validation
  await runTest("3. validateFile: valid PNG accepted with dimensions", async () => {
    const result = validateFile({
      buffer: makePng(4, 3, 7),
      fileName: "Hero Image.PNG",
      declaredMimeType: "image/png",
      category: "hotel_logo",
    });
    assert(result.mimeType === "image/png", "MIME should be sniffed from bytes");
    assert(result.extension === "png", "Extension should be canonical");
    assert(result.width === 4 && result.height === 3, "PNG dimensions not parsed");
    assert(result.originalName === "hero-image.png", `Bad sanitized name: ${result.originalName}`);
  });

  await runTest("4. validateFile rejects: empty, oversized, bad extension, content mismatch", async () => {
    const empty = await expectApiError(() =>
      Promise.resolve(
        validateFile({ buffer: Buffer.alloc(0), fileName: "x.png", category: "hotel_logo" }),
      ),
    );
    assert(empty.statusCode === 400, "Empty file should be 400");

    const oversized = await expectApiError(() =>
      Promise.resolve(
        validateFile({
          buffer: Buffer.concat([makePng(1, 1, 1), Buffer.alloc(5 * 1024 * 1024)]),
          fileName: "big.png",
          category: "hotel_logo",
        }),
      ),
    );
    assert(oversized.statusCode === 400, "Oversized file should be 400");

    const badExt = await expectApiError(() =>
      Promise.resolve(
        validateFile({ buffer: makePng(), fileName: "notes.txt", category: "hotel_logo" }),
      ),
    );
    assert(badExt.statusCode === 400, "Unsupported extension should be 400");

    const textPng = await expectApiError(() =>
      Promise.resolve(
        validateFile({
          buffer: Buffer.from("<svg onload=alert(1)>", "utf8"),
          fileName: "evil.png",
          category: "hotel_logo",
        }),
      ),
    );
    assert(textPng.statusCode === 400, "Content mismatch should be 400");

    const renamed = await expectApiError(() =>
      Promise.resolve(
        validateFile({ buffer: makePng(), fileName: "photo.jpg", category: "hotel_logo" }),
      ),
    );
    assert(renamed.statusCode === 400, "Extension/content mismatch should be 400");
  });

  await runTest("5. validateFile: category MIME rules (PDF rejected for logo)", async () => {
    const err = await expectApiError(() =>
      Promise.resolve(
        validateFile({ buffer: makePdf(), fileName: "doc.pdf", category: "hotel_logo" }),
      ),
    );
    assert(err.statusCode === 400, "PDF for logo should be rejected");
    // Same bytes are valid for a document category.
    const ok = validateFile({
      buffer: makePdf(),
      fileName: "doc.pdf",
      category: "hotel_document",
    });
    assert(ok.mimeType === "application/pdf", "PDF should be accepted for documents");
  });

  await runTest("6. Magic-byte sniffing for JPEG and WEBP", async () => {
    assert(sniffMimeType(makeJpeg()) === "image/jpeg", "JPEG signature not detected");
    assert(sniffMimeType(makeWebp()) === "image/webp", "WEBP signature not detected");
    assert(sniffMimeType(Buffer.from("hello world")) === null, "Unknown content must return null");
    assert(extractImageDimensions(makeWebp(), "image/webp") === null, "Unknown dims should be null");
  });

  await runTest("7. sanitizeFileName strips traversal and unsafe characters", async () => {
    assert(sanitizeFileName("../../evil.png") === "evil.png", "Path traversal not stripped");
    assert(!/[\\/]/.test(sanitizeFileName("a/b\\c.png")), "Directory separators must be gone");
    const name = sanitizeFileName("My Photo (1).PNG");
    assert(name === "my-photo-1.png", `Unexpected sanitized name: ${name}`);
  });

  await runTest("8. isSafeStorageKey rejects escapes", async () => {
    assert(!isSafeStorageKey("../etc/passwd"), "Relative escape accepted");
    assert(!isSafeStorageKey("/etc/passwd"), "Absolute path accepted");
    assert(!isSafeStorageKey("a\\b"), "Backslash accepted");
    assert(!isSafeStorageKey(""), "Empty key accepted");
    assert(isSafeStorageKey("hotels/abc/logo/x.png"), "Valid key rejected");
  });

  await runTest("9. buildStorageKey is tenant-prefixed and server-constructed", async () => {
    const logo = buildStorageKey({
      hotelId: hotelA.id,
      category: "hotel_logo",
      originalName: "logo.png",
    });
    assert(
      logo.key.startsWith(`hotels/${hotelA.id}/logo/`),
      `Key not tenant-prefixed: ${logo.key}`,
    );
    assert(logo.key.endsWith(".png"), "Key should keep the extension");

    const room = buildStorageKey({
      hotelId: hotelA.id,
      category: "room_image",
      branchId: branchA.id,
      entityId: roomId,
      originalName: "room.png",
    });
    assert(
      room.key.startsWith(`hotels/${hotelA.id}/branches/${branchA.id}/rooms/${roomId}/`),
      `Room key wrong: ${room.key}`,
    );

    const bad = await expectApiError(() =>
      Promise.resolve(
        buildStorageKey({ hotelId: "not-an-id", category: "hotel_logo", originalName: "x.png" }),
      ),
    );
    assert(bad.statusCode === 400, "Invalid hotelId should be rejected");
  });

  // ---------------------------------------------------------------- upload
  await runTest("10. Upload public logo: bytes in storage, metadata in Mongo", async () => {
    const before = await countStoredFiles(STORAGE_ROOT);
    const asset = await createFileAsset({
      hotelId: hotelA.id,
      category: "hotel_logo",
      file: { buffer: makePng(6, 6, 11), fileName: "logo.png", declaredMimeType: "image/png" },
    });
    logoId = asset.id;

    assert(asset.status === "active", "Asset should be active");
    assert(asset.access === "public", "Logo should be public");
    assert(asset.storageProvider === "local", "Provider should be local");
    assert(asset.url === `/api/files/${asset.id}/content`, `Unexpected url: ${asset.url}`);
    assert(asset.width === 6 && asset.height === 6, "Dimensions missing");

    const doc = await FileAsset.findById(asset.id).lean().exec();
    assert(doc !== null, "Document not persisted");
    assert(doc!.storageKey.startsWith(`hotels/${hotelA.id}/logo/`), "Storage key not tenant-prefixed");

    const after = await countStoredFiles(STORAGE_ROOT);
    assert(after === before + 1, `Expected 1 stored file, found ${after - before}`);

    const stored = await fs.readFile(path.join(STORAGE_ROOT, doc!.storageKey));
    assert(stored.length === asset.size, "Stored bytes differ from reported size");
  });

  await runTest("11. Upload rejects invalid bytes (no storage write, no document)", async () => {
    const beforeFiles = await countStoredFiles(STORAGE_ROOT);
    const beforeDocs = await FileAsset.countDocuments({ hotelId: hotelA.id });
    const err = await expectApiError(() =>
      createFileAsset({
        hotelId: hotelA.id,
        category: "hotel_gallery",
        file: { buffer: Buffer.from("not an image"), fileName: "fake.png" },
      }),
    );
    assert(err.statusCode === 400, "Invalid content should be 400");
    assert((await countStoredFiles(STORAGE_ROOT)) === beforeFiles, "Storage file was written");
    assert(
      (await FileAsset.countDocuments({ hotelId: hotelA.id })) === beforeDocs,
      "Document was created",
    );
  });

  await runTest("12. Upload rejects oversized file at the service boundary", async () => {
    const big = Buffer.concat([makePng(1, 1, 2), Buffer.alloc(5 * 1024 * 1024 + 1)]);
    const err = await expectApiError(() =>
      createFileAsset({
        hotelId: hotelA.id,
        category: "hotel_gallery",
        file: { buffer: big, fileName: "huge.png" },
      }),
    );
    assert(err.statusCode === 400, "Oversized upload should be 400");
  });

  await runTest("13. Entity rules: room category requires branch + room id", async () => {
    const missingEntity = await expectApiError(() =>
      createFileAsset({
        hotelId: hotelA.id,
        category: "room_image",
        branchId: branchA.id,
        file: { buffer: makePng(2, 2, 21), fileName: "room.png" },
      }),
    );
    assert(missingEntity.statusCode === 400, "Missing entityId should be 400");

    const missingBranch = await expectApiError(() =>
      createFileAsset({
        hotelId: hotelA.id,
        category: "room_image",
        entityId: roomId,
        file: { buffer: makePng(2, 2, 22), fileName: "room.png" },
      }),
    );
    assert(missingBranch.statusCode === 400, "Missing branchId should be 400");
  });

  await runTest("14. Cross-tenant branch upload blocked (404, not 403)", async () => {
    const err = await expectApiError(() =>
      createFileAsset({
        hotelId: hotelA.id, // tenant A
        category: "room_image",
        branchId: branchB.id, // branch of tenant B
        entityId: roomId,
        file: { buffer: makePng(2, 2, 23), fileName: "cross.png" },
      }),
    );
    assert(err.statusCode === 404, "Cross-tenant branch must be a 404");
  });

  // ------------------------------------------------------------- lifecycle
  await runTest("15. Replace flow: old object removed, old metadata soft-deleted", async () => {
    const before = await countStoredFiles(STORAGE_ROOT);
    const first = await FileAsset.findById(logoId).lean().exec();
    const second = await createFileAsset({
      hotelId: hotelA.id,
      category: "hotel_logo",
      replaceFileId: logoId,
      file: { buffer: makePng(7, 7, 31), fileName: "logo-v2.png" },
    });
    assert(second.id !== logoId, "Replace should create a new asset");

    const oldDoc = await FileAsset.findById(logoId).lean().exec();
    assert(oldDoc!.status === "deleted", "Old asset should be soft-deleted");
    assert(!(await fs.access(path.join(STORAGE_ROOT, first!.storageKey)).then(() => true).catch(() => false)), "Old storage object should be removed");

    const after = await countStoredFiles(STORAGE_ROOT);
    assert(after === before, `Replace should be storage-neutral, delta was ${after - before}`);
    logoId = second.id;
  });

  await runTest("16. Single-value category auto-replaces the previous active asset", async () => {
    const third = await createFileAsset({
      hotelId: hotelA.id,
      category: "hotel_logo",
      file: { buffer: makePng(8, 8, 32), fileName: "logo-v3.png" },
    });
    const active = await FileAsset.find({
      hotelId: hotelA.id,
      category: "hotel_logo",
      status: "active",
    }).exec();
    assert(active.length === 1, `Expected exactly 1 active logo, got ${active.length}`);
    assert(active[0]._id.toString() === third.id, "Newest logo should be the active one");
    logoId = third.id;
  });

  await runTest("17. Duplicate content is deduplicated per entity", async () => {
    const bytes = makePng(5, 5, 41);
    const first = await createFileAsset({
      hotelId: hotelA.id,
      category: "hotel_gallery",
      file: { buffer: bytes, fileName: "gallery-one.png" },
    });
    galleryOneId = first.id;
    const before = await countStoredFiles(STORAGE_ROOT);

    const second = await createFileAsset({
      hotelId: hotelA.id,
      category: "hotel_gallery",
      file: { buffer: bytes, fileName: "gallery-one-copy.png" },
    });
    assert(second.id === first.id, "Identical content should reuse the existing asset");
    assert((await countStoredFiles(STORAGE_ROOT)) === before, "Duplicate wrote another object");

    galleryTwoId = (
      await createFileAsset({
        hotelId: hotelA.id,
        category: "hotel_gallery",
        file: { buffer: makePng(9, 9, 42), fileName: "gallery-two.png" },
      })
    ).id;
  });

  // ----------------------------------------------------------------- query
  await runTest("18. List: filters, limit clamping and pagination meta", async () => {
    const result = await listFiles({
      hotelId: hotelA.id,
      page: 1,
      limit: 500,
      sort: { createdAt: -1 },
      search: "",
      category: "hotel_gallery",
    });
    assert(result.meta.limit === 100, `Limit should clamp to 100, got ${result.meta.limit}`);
    assert(result.items.length === 2, `Expected 2 gallery images, got ${result.items.length}`);
    assert(result.items.every((i) => i.category === "hotel_gallery"), "Category filter failed");
    assert(result.meta.total === 2, "Total mismatch");
    assert(!JSON.stringify(result.items).includes("storageKey"), "storageKey leaked in DTOs");
    assert(!JSON.stringify(result.items).includes("accessToken"), "accessToken leaked in DTOs");
  });

  await runTest("19. Patch sortOrder reorders the gallery listing", async () => {
    await patchFileAsset(galleryTwoId, hotelA.id, { sortOrder: 1 });
    await patchFileAsset(galleryOneId, hotelA.id, { sortOrder: 5 });

    const result = await listFiles({
      hotelId: hotelA.id,
      page: 1,
      limit: 10,
      // The route translates the public `sortOrder` key to this field.
      sort: { "metadata.sortOrder": 1 },
      search: "",
      category: "hotel_gallery",
    });
    assert(result.items[0].id === galleryTwoId, "sortOrder=1 image should be first");
    assert(result.items[1].id === galleryOneId, "sortOrder=5 image should be second");
  });

  await runTest("20. Patch isPrimary clears the flag on siblings", async () => {
    await patchFileAsset(galleryOneId, hotelA.id, { isPrimary: true });
    const one = await getFileAsset(galleryOneId, hotelA.id);
    const two = await getFileAsset(galleryTwoId, hotelA.id);
    assert(one.isPrimary, "Selected image should be primary");
    assert(!two.isPrimary, "Sibling should be cleared");
  });

  await runTest("21. Cross-tenant metadata access: GET/PATCH/DELETE all return 404", async () => {
    const getErr = await expectApiError(() => getFileAsset(galleryOneId, hotelB.id));
    assert(getErr.statusCode === 404, "Cross-tenant GET should be 404");

    const patchErr = await expectApiError(() =>
      patchFileAsset(galleryOneId, hotelB.id, { sortOrder: 99 }),
    );
    assert(patchErr.statusCode === 404, "Cross-tenant PATCH should be 404");

    const before = await countStoredFiles(STORAGE_ROOT);
    const deleteErr = await expectApiError(() => deleteFileAsset(galleryOneId, hotelB.id));
    assert(deleteErr.statusCode === 404, "Cross-tenant DELETE should be 404");
    assert((await countStoredFiles(STORAGE_ROOT)) === before, "Cross-tenant delete touched storage");

    const doc = await FileAsset.findById(galleryOneId).lean().exec();
    assert(doc!.status === "active", "File must survive the cross-tenant attempt");
  });

  // --------------------------------------------------------- private access
  await runTest("22. Private document: token-gated access, token never in the DTO", async () => {
    const doc = await createFileAsset({
      hotelId: hotelA.id,
      category: "hotel_document",
      file: { buffer: makePdf(9), fileName: "gst.pdf", declaredMimeType: "application/pdf" },
    });
    privateDocId = doc.id;
    assert(doc.access === "private", "Document should be private");
    assert(doc.url.includes("?t="), "Private URL should carry the access token");

    const full = await FileAsset.findById(doc.id).lean().exec();
    privateDocToken = String(
      (full!.metadata as Record<string, unknown>).accessToken ?? "",
    );
    assert(privateDocToken.length === 32, "Access token missing");

    const dtoKeys = Object.keys(doc);
    assert(!dtoKeys.includes("accessToken"), "accessToken must not be a DTO field");
    assert(!dtoKeys.includes("storageKey"), "storageKey must not be a DTO field");
    assert(!dtoKeys.includes("metadata"), "metadata must not be a DTO field");
    // The token reaches the browser only through the delivery URL itself.
    assert(doc.url.includes(privateDocToken), "Private URL should carry the access token");
    assert(
      JSON.stringify({ ...doc, url: "", secureUrl: "" }).indexOf(privateDocToken) === -1,
      "Token leaked outside the delivery URLs",
    );

    await expectApiError(() => getFileForAccess(doc.id, undefined));
    await expectApiError(() => getFileForAccess(doc.id, "wrong-token"));
    const resolved = await getFileForAccess(doc.id, privateDocToken);
    assert(resolved._id.toString() === doc.id, "Valid token should resolve the file");
  });

  await runTest("23. Signed storage-key URLs: valid, tampered and expired signatures", async () => {
    const full = await FileAsset.findById(privateDocId).lean().exec();
    const key = full!.storageKey;
    const exp = Date.now() + 60_000;
    const sig = signStorageKey(key, exp);

    assert(verifyStorageKeySignature(key, exp, sig), "Valid signature rejected");
    assert(
      !verifyStorageKeySignature(key, exp, sig.replace(/^./, "0")),
      "Tampered signature accepted",
    );
    assert(
      !verifyStorageKeySignature(key, Date.now() - 1000, signStorageKey(key, Date.now() - 1000)),
      "Expired signature accepted",
    );

    const resolved = await getFileBySignedKey(key, exp, sig);
    assert(resolved._id.toString() === privateDocId, "Signed lookup failed");

    const tamperErr = await expectApiError(() => getFileBySignedKey(key, exp, "bad-signature"));
    assert(tamperErr.statusCode === 403, "Tampered lookup should be 403");
  });

  // ------------------------------------------------------ failure injection
  await runTest("24. Storage failure: user-safe 500 and no orphan document", async () => {
    const failing: StorageProvider = {
      name: "local",
      uploadFile: () => Promise.reject(new Error("ECONNREFUSED (injected)")),
      deleteFile: () => Promise.resolve(),
      getFile: () => Promise.resolve(null),
      getPublicUrl: (key: string) => key,
      getSignedUrl: () => Promise.reject(new Error("not available")),
    };
    setStorageProvider(failing);
    const beforeDocs = await FileAsset.countDocuments({ hotelId: hotelA.id });
    try {
      const err = await expectApiError(() =>
        createFileAsset({
          hotelId: hotelA.id,
          category: "hotel_gallery",
          file: { buffer: makePng(3, 3, 51), fileName: "will-fail.png" },
        }),
      );
      assert(err.statusCode === 500, `Expected 500, got ${err.statusCode}`);
      assert(
        !err.message.includes("ECONNREFUSED"),
        "Raw storage error leaked to the user",
      );
      assert(
        (await FileAsset.countDocuments({ hotelId: hotelA.id })) === beforeDocs,
        "Orphan document was created",
      );
    } finally {
      setStorageProvider(null);
    }
  });

  await runTest("25. DB save failure compensates: storage object is removed", async () => {
    const beforeFiles = await countStoredFiles(STORAGE_ROOT);
    const beforeDocs = await FileAsset.countDocuments({ hotelId: hotelA.id });
    const proto = FileAsset.prototype as unknown as { save: () => Promise<unknown> };
    const originalSave = proto.save;
    proto.save = () => Promise.reject(new Error("save failed (injected)"));
    try {
      const err = await expectApiError(() =>
        createFileAsset({
          hotelId: hotelA.id,
          category: "hotel_gallery",
          file: { buffer: makePng(3, 3, 52), fileName: "save-fail.png" },
        }),
      );
      assert(err.statusCode >= 400, "Injected save failure should surface as an error");
      assert(
        (await countStoredFiles(STORAGE_ROOT)) === beforeFiles,
        "Upload was not compensated — orphan object left behind",
      );
      assert(
        (await FileAsset.countDocuments({ hotelId: hotelA.id })) === beforeDocs,
        "Document was created despite the failed save",
      );
    } finally {
      proto.save = originalSave;
    }
  });

  await runTest("26. Delete: storage object removed, metadata soft-deleted", async () => {
    const doc = await FileAsset.findById(galleryTwoId).lean().exec();
    const before = await countStoredFiles(STORAGE_ROOT);

    const deleted = await deleteFileAsset(galleryTwoId, hotelA.id);
    assert(deleted.status === "deleted", "DTO should report deleted status");

    assert(
      !(await fs
        .access(path.join(STORAGE_ROOT, doc!.storageKey))
        .then(() => true)
        .catch(() => false)),
      "Storage object still exists after delete",
    );
    assert((await countStoredFiles(STORAGE_ROOT)) === before - 1, "File count mismatch");

    await expectApiError(() => getFileAsset(galleryTwoId, hotelA.id));
  });

  // --------------------------------------------------------- binary in Mongo
  await runTest("27. MongoDB stores metadata only — never binary bytes", async () => {
    const docs = await FileAsset.find({}).lean().exec();
    assert(docs.length > 0, "No FileAsset documents to inspect");
    for (const doc of docs) {
      const json = JSON.stringify(doc);
      assert(json.length < 4000, `Document too large (${json.length} bytes) — binary in DB?`);
      assert(!/"buffer"/.test(json), "Raw buffer field found in the document");
      assert(!/"data":"data:/.test(json), "Base64 payload found in the document");
    }
  });

  await runTest("28. Client-side pre-validation mirrors the server rules", async () => {
    const fakePng = new File([new Uint8Array(makePng())], "ok.png", { type: "image/png" });
    assert(validateFileClient(fakePng, "hotel_logo") === null, "Valid PNG rejected client-side");

    const fakePdf = new File([new Uint8Array(makePdf())], "doc.pdf", { type: "application/pdf" });
    const error = validateFileClient(fakePdf, "hotel_logo");
    assert(typeof error === "string" && error.length > 0, "PDF-as-logo should fail client-side");

    const huge = new File([new Uint8Array(6 * 1024 * 1024)], "huge.png", { type: "image/png" });
    const sizeError = validateFileClient(huge, "hotel_gallery");
    assert(sizeError !== null && sizeError.includes("too large"), "Oversize should fail client-side");
  });

  await runTest("29. Response envelope carries the success flag", async () => {
    const ok = jsonOk({ hello: "world" });
    const okBody = (await ok.json()) as Record<string, unknown>;
    assert(okBody.success === true, "jsonOk should set success: true");
    assert(typeof okBody.data === "object", "jsonOk should carry data");

    const bad = jsonError(ApiError.notFound("File not found"));
    const badBody = (await bad.json()) as { success: boolean; error?: { code?: string } };
    assert(badBody.success === false, "jsonError should set success: false");
    assert(badBody.error?.code === "NOT_FOUND", "Error code missing from the envelope");
    assert(bad.status === 404, "Status code mismatch");
  });

  // --------------------------------------------------------------- cleanup
  console.log("\nCleaning up…");
  await FileAsset.deleteMany({});
  await Branch.deleteMany({ hotelId: { $in: [hotelA.id, hotelB.id] } });
  await Hotel.deleteMany({ _id: { $in: [hotelA.id, hotelB.id] } });
  await disconnectDB();
  await fs.rm(STORAGE_ROOT, { recursive: true, force: true });

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`\nTotal: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  if (failed > 0) {
    results.filter((r) => !r.passed).forEach((r) => console.log(`  - ${r.name}: ${r.error}`));
    process.exit(1);
  }
  console.log("All Phase 7 tests passed!");
  process.exit(0);
}

main().catch(async (error) => {
  console.error("Phase 7 test suite crashed:", error);
  await disconnectDB().catch(() => undefined);
  process.exit(1);
});
