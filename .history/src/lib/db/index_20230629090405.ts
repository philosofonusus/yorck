import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { env } from "../../env.mjs";
import { user } from "./schema";

const connection = connect({
  url: env.DATABASE_URL,
});

export const db = drizzle(connection);

db.insert(user).values({
  fullName: "John Doe",
  phone: "555-555-5555",
});
