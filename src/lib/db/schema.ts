import { json, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const addressLists = mysqlTable("address_lists", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  addresses: json("addresses").notNull().default("[]"),
  userId: varchar("userId", { length: 191 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  favorites: json("favorites").notNull().default("[]"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  synced_at: timestamp("synced_at"),
});
