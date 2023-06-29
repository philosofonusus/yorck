import {
  index,
  int,
  mysqlTable,
  serial,
  varchar,
} from "drizzle-orm/mysql-core";
import { db } from ".";

export const users = mysqlTable("users", {
  id: serial("cuid").primaryKey(),
  name: varchar("name", {
    length: 255,
  }),
});

db.insert(users);
