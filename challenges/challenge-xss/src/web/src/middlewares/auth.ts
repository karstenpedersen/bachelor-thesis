import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { getCookie, } from "hono/cookie";

/**
 * Checks if user is signed.
 */
const auth = createMiddleware(async (c, next) => {
  const secret = process.env.JWT_SECRET ?? "mySecretKey";
  const jwtCookie = getCookie(c, 'jwt');

  if (jwtCookie) {
    try {
      const decodedPayload = await verify(jwtCookie, secret);

      c.set('jwtPayload', decodedPayload);
      c.set('isLoggedIn', true);
    } catch (_err) {
      c.set('jwtPayload', undefined);
      c.set('isLoggedIn', false);
    }
  } else {
    c.set('jwtPayload', undefined);
    c.set('isLoggedIn', false);
  }

  await next();
});

export default auth;
