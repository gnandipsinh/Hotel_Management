import { connectDB, disconnectDB } from "@/lib/db/mongoose";
import { Module } from "@/models/Module";
import { Permission } from "@/models/Permission";
import { Role } from "@/models/Role";
import { MODULE_CATALOG, PERMISSION_MATRIX, SYSTEM_ROLES } from "./seedData";

export interface SeedResult {
  modules: { inserted: number; existing: number };
  permissions: { inserted: number; existing: number };
  roles: { inserted: number; existing: number };
}

async function upsertModule(module: typeof MODULE_CATALOG[0]) {
  const result = await Module.updateOne(
    { key: module.key },
    { $setOnInsert: module },
    { upsert: true }
  );
  return result.upsertedCount > 0 ? "inserted" : "existing";
}

async function upsertPermission(perm: typeof PERMISSION_MATRIX[0]) {
  const result = await Permission.updateOne(
    { key: perm.key },
    { $setOnInsert: perm },
    { upsert: true }
  );
  return result.upsertedCount > 0 ? "inserted" : "existing";
}

async function upsertRole(role: typeof SYSTEM_ROLES[0]) {
  const permissions = await Permission.find({ key: { $in: role.permissionKeys } }).lean();
  const permissionIds = permissions.map((p) => p._id);
  
  const result = await Role.updateOne(
    { hotelId: { $exists: false }, name: role.name },
    { $setOnInsert: { ...role, permissionIds } },
    { upsert: true }
  );
  return result.upsertedCount > 0 ? "inserted" : "existing";
}

export async function runSeed(): Promise<SeedResult> {
  await connectDB();

  const result: SeedResult = {
    modules: { inserted: 0, existing: 0 },
    permissions: { inserted: 0, existing: 0 },
    roles: { inserted: 0, existing: 0 },
  };

  for (const entry of MODULE_CATALOG) {
    const res = await upsertModule(entry);
    result.modules[res]++;
  }

  for (const perm of PERMISSION_MATRIX) {
    const res = await upsertPermission(perm);
    result.permissions[res]++;
  }

  for (const role of SYSTEM_ROLES) {
    const res = await upsertRole(role);
    result.roles[res]++;
  }

  await disconnectDB();
  return result;
}