import { serve } from "@hono/node-server";
import app from "./app.js";

/**
 * The port to serve from.
 *
 * Defaults to 3000.
 */
const port = Number(process.env.PORT || 3000);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

