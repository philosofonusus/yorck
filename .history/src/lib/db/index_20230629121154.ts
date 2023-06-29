import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { env } from "../../../env.mjs";
import { fetch } from "undici";

const connection = connect({
  url: env.DATABASE_URL,
  fetch,
});
console.log("🚀 ~ file: index.ts:8 ~ connection:", connection);

export const db = drizzle(connection);
