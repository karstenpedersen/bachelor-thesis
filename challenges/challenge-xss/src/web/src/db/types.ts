import type { z } from "zod";
import { userTable, postTable } from "./schema.js";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// User
export const UserSelectSchema = createSelectSchema(userTable);
export const UserInsertSchema = createInsertSchema(userTable);

export type UserSelect = z.infer<typeof UserSelectSchema>;
export type UserInsert = z.infer<typeof UserInsertSchema>;

// Post
export const PostSelectSchema = createSelectSchema(postTable);
export const PostInsertSchema = createInsertSchema(postTable);
export const NewPostSchema = PostInsertSchema;

export type PostSelect = z.infer<typeof PostSelectSchema>;
export type PostInsert = z.infer<typeof PostInsertSchema>;
export type NewPost = z.infer<typeof NewPostSchema>;

