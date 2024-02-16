import type { Config } from "drizzle-kit";
import "dotenv/config";
import { env } from "./env.mjs";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  driver: "mysql2",
  dbCredentials: {
    uri: env.DATABASE_URL,
  },
  breakpoints: true,
} satisfies Config;
