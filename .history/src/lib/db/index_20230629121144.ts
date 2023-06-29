import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { env } from "../../../env.mjs";

const connection = connect({
  url: env.DATABASE_URL,
  
});
console.log("🚀 ~ file: index.ts:8 ~ connection:", connection);

export const db = drizzle(connection);
