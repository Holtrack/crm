import "reflect-metadata";
import "dotenv/config";
import { AppDataSource } from "../src/database/data-source";

async function main() {
  await AppDataSource.initialize();
  console.log("Running migrations...");
  await AppDataSource.runMigrations({ transaction: "each" });
  console.log("Migrations complete.");
  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
