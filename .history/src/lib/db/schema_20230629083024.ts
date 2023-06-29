import {
  index,
  int,
  mysqlTable,
  serial,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: serial().primary(),
    name: varchar(255),
    created_at: index().timestamp().default("CURRENT_TIMESTAMP"),
});
