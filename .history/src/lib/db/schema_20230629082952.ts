import {
  index,
  int,
  mysqlTable,
  serial,
  varchar,
} from "drizzle-orm/mysql-core";


export const schema = mysqlTable({
    name: "schema",
    columns: [
        