import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import { logger } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";
import draftsRoutes from "./routes/drafts.js";
import auth from "./middlewares/auth.js";
import notFound from "./middlewares/notFound.js";
import onError from "./middlewares/onError.js";
import { createRouter } from "./utils/router.js";
import homeRoutes from "./routes/home.js";

/**
 * Primary Hono app.
 */
const app = createRouter();

// Middlewares
app.use(logger());
app.use(auth);
app.notFound(notFound);
app.onError(onError);

// Serve static files
app.use("/static/*", serveStatic({ root: "./" }));

// Home page
app.route("/", homeRoutes);
app.route("/", userRoutes);
app.route("/", postRoutes);
app.route("/", authRoutes);
app.route("/", draftsRoutes);

/**
 * Primary Hono app type.
 */
export type App = typeof app;

export default app;

