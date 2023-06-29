import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import { env } from "./src/env.mjs";

export default {
  schema: "src/db/schema.ts",
  out: "drizzle/migrations",
  driver: "mysql2",
  dbCredentials: {
    host: env.DATABASE_HOST,
    user: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    database: "monitorus",
  },
} satisfies Config;
