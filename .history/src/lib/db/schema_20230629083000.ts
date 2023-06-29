import {
  index,
  int,
  mysqlTable,
  serial,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", (t) => {
    t.id("id", serial());
    t.varchar("name", varchar(255));
    t.int("age", int());
    t.index("name", index());
    }
    