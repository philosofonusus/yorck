import {
  index,
  int,
  mysqlTable,
  serial,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: serial().primary(),
});
