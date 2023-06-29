import { drizzle } from "drizzle-orm/node-postgres";
import { connect } from "drizzle-orm/node-postgres";
import { env } from "../env.mjs";

const connection = connect({
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
});
