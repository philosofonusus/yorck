import { migrate } from "drizzle-orm/planetscale-serverless/migrator";
import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { fetch } from "undici";
import "dotenv/config";
import { env } from "../../../env.mjs";

const runMigrate = async () => {
  const connection = connect({
    url: env.DATABASE_URL,
    fetch,
  });
  console.log(
    "🚀 ~ file: migrate.ts:13 ~ runMigrate ~ env.DATABASE_URL:",
    env.DATABASE_URL
  );

  const db = drizzle(connection);

  console.log("⏳ Running migrations...");

  const start = Date.now();

  await migrate(db, { migrationsFolder: "src/lib/db/migrations" });

  const end = Date.now();

  console.log(`✅ Migrations completed in ${end - start}ms`);

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
