import { Hono } from "hono";
import type { AppVariables } from "../types.js";

/**
 * Creates a new Hono instance.
 */
export function createRouter() {
  return new Hono<{ Variables: AppVariables }>();
}

