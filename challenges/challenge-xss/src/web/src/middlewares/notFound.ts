import type { NotFoundHandler } from "hono";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

/**
 * Hono middleware for handling not found status.
 */
const notFound: NotFoundHandler = (c) => {
  return c.json(
    {
      error: {
        code: StatusCodes.NOT_FOUND,
        message: `${ReasonPhrases.NOT_FOUND} - ${c.req.path}`,
      },
    },
    StatusCodes.NOT_FOUND
  );
};

export default notFound;

