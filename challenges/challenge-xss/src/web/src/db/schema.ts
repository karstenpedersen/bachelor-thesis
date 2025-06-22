import { relations } from "drizzle-orm";
import { serial, timestamp, boolean, varchar, integer, pgTable, text } from "drizzle-orm/pg-core";

/**
 * Postgresql user table.
 */
export const userTable = pgTable("user", {
  id: serial().primaryKey(),
  username: varchar({ length: 48 }).notNull(),
  password: text().notNull(),
  email: varchar({ length: 128 }).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

/**
 * Postgresql post table.
 */
export const postTable = pgTable("post", {
  id: serial().primaryKey(),
  userId: integer("user_id").notNull(),
  title: varchar({ length: 50 }).notNull(),
  body: varchar({ length: 255 }).notNull(),
  isDraft: boolean("is_draft").default(false).notNull(),
  createdAt: timestamp().defaultNow(),
});

/**
 * One-to-many relation between post and user tables.
 */
export const userPostRelation = relations(postTable, ({ one }) => ({
  user: one(userTable, {
    fields: [postTable.userId],
    references: [userTable.id],
  }),
}));
