import {
  index,
  int,
  mysqlTable,
  serial,
  varchar,
} from "drizzle-orm/mysql-core";
import { InferModel } from "drizzle-orm";
import { db } from ".";

export const users = mysqlTable("users", {
  id: serial("cuid").primaryKey(),
  name: varchar("name", {
    length: 255,
  }),
});

export type User = InferModel<typeof users>; // return type when queried
export type NewUser = InferModel<typeof users, "insert">; // insert type

db.insert(users);
