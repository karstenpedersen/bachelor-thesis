import { deleteCookie } from "hono/cookie";
import { StatusCodes } from "http-status-codes";
import { createRouter } from "../utils/router.js";

/**
 * User routes.
 */
const userRoutes = createRouter();

userRoutes.get("/logout", async (c) => {
  deleteCookie(c, "jwt");
  return c.redirect('/', StatusCodes.MOVED_TEMPORARILY);
});

export default userRoutes;
