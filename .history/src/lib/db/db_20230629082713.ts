import { drizzle } from "drizzle-orm/node-postgres";
import { connect } from "@planetscale/database";
import { env } from "../../env.mjs";

const connection = connect({
  host: env.DATABASE_HOST,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
});

export const db = drizzle(connection);
