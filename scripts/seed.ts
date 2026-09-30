import "dotenv/config";
import { runSeed } from "@/services/seed/seedService";

async function main() {
  console.log("🌱 Starting database seed...");
  try {
    const result = await runSeed();
    console.log("✅ Seed completed:");
    console.log(`   Modules:    ${result.modules.inserted} inserted, ${result.modules.existing} existing`);
    console.log(`   Permissions: ${result.permissions.inserted} inserted, ${result.permissions.existing} existing`);
    console.log(`   Roles:       ${result.roles.inserted} inserted, ${result.roles.existing} existing`);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

main();