import * as schema from "./schema.js";
import { drizzle } from "drizzle-orm/node-postgres";
import seed from "./seed.js";

/**
 * SQLite database instance.
 */
const db = drizzle(process.env.DATABASE_URL, { schema });

// Seed database in development
if (process.env.NODE_ENV !== "production") {
  seed();
}

export default db;
