import type { Config } from "drizzle-kit";
import "dotenv/config";

console.log("DATABASE_URL", process.env.DATABASE_URL);

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  driver: "mysql2",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL as string,
  },
  breakpoints: true,
} satisfies Config;
