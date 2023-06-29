import { connect } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { env } from "../env.mjs";

const connection = connect({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(connection);
