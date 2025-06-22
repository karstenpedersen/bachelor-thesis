import bcrypt from 'bcrypt';
import generator from 'generate-password';
import db from '../db/index.js';
import { userTable } from '../db/schema.js';
import type { UserSelect } from '../db/types.js';

/**
 * Salt rounds used for hashing.
 */
export const SALT_ROUNDS = 10;

/**
 * Generates a random password.
 */
export function generatePassword(): string {
  return generator.generate({
    length: 64,
    numbers: true,
    symbols: true,
    strict: true
  });
}

/**
 * Creates an user.
 */
export async function createUser(username: string, email: string, password: string, isAdmin = false): Promise<number> {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await db.insert(userTable).values({
    username,
    email,
    password: hashedPassword,
    isAdmin: isAdmin,
  }).returning({
    id: userTable.id
  });

  return result[0].id;
}

/**
 * Creates a mock user.
 */
export async function createMockUser(username: string): Promise<number> {
  const password = generatePassword();
  const email = `${username.toLowerCase()}@mail.com`;
  return createUser(username, email, password, false);
}

/**
 * Gets a users display name.
 *
 * Inserts '(Admin)' after their name, if the user is an admin.
 */
export function getUserDisplayName(user: UserSelect): string {
  return user.isAdmin ? `${user.username} (Admin)` : user.username;
}

/**
 * Finds an user by their username.
 */
export async function findUserByUsername(username: string): Promise<UserSelect | undefined> {
  return await db.query.userTable.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });
}

/**
 * Finds an user by their id.
 */
export async function findUserById(id: number): Promise<UserSelect | undefined> {
  return await db.query.userTable.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  });
}
