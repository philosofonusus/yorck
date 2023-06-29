import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { env } from "../env.mjs";

const connection = connect({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(connection);
