import db from '../db/index.js';
import { postTable } from '../db/schema.js';
import { type NewPost, NewPostSchema, type PostSelect } from '../db/types.js'; 

/**
 * Creates a post.
 */
export async function createPost(post: NewPost): Promise<number> {
  const parsedPost = NewPostSchema.parse(post);
  const result = await db.insert(postTable).values(parsedPost).returning({
    id: postTable.id
  });
  return result[0].id;
}

/**
 * Finds a post by its id.
 */
export async function findPostById(id: number): Promise<PostSelect | undefined> {
  return await db.query.postTable.findFirst({
    where: (posts, { eq }) => eq(posts.id, id),
  });
}

/**
 * Finds posts for an user by the user's id.
 */
export async function findPostByUserId(userId: number): Promise<PostSelect[]> {
  return await db.query.postTable.findMany({
    where: (posts, { eq }) => eq(posts.userId, userId),
  });
}
