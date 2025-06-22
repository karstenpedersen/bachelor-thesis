import type { ErrorHandler } from "hono";
import { StatusCodes } from "http-status-codes";

/**
 * Hono middleware for handling errors.
 */
const onError: ErrorHandler = (err, c) => {
  console.error(`${err}`);
  return c.text("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR);
};

export default onError;

