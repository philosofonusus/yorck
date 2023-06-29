import type { Config } from "drizzle-kit";
import "dotenv/config";
import { env } from "./src/env.mjs";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  breakpoints: true,
} satisfies Config;
