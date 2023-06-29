import { mysqlTable, serial, text, varchar, int } from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: serial("id").primaryKey(),
  fullName: text("full_name"),
  email: varchar("email", { length: 256 }),
  phone: varchar("phone", { length: 256 }),
});

export const post = mysqlTable("post", {
  id: serial("id").primaryKey(),
  title: text("title"),
  likes: int("likes"),
  userId: int("userId"),
});
