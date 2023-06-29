import type { Config } from "drizzle-kit";
import "dotenv/config";
import { env } from "./src/env.mjs";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  driver: "mysql2",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL as string,
  },
  breakpoints: true,
} satisfies Config;
