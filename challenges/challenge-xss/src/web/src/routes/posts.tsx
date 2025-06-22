import db from "../db/index.js";
import SidebarLayout from "../components/SidebarLayout.js";
import BaseLayout from "../components/BaseLayout.js";
import { findUserById } from "../utils/userUtils.js";
import { postTable } from "../db/schema.js";
import { createRouter } from "../utils/router.js";

/**
 * Posts routes.
 */
const postRoutes = createRouter();

postRoutes.get("/posts", async (c) => {
  const posts = await db.query.postTable.findMany({
    where: (posts, { eq }) => eq(posts.isDraft, false),
    with: {
      user: true,
    },
  });

  return c.html(
    <BaseLayout title="Posts">
      <h1>Post List</h1>
      <table border={1}>
        <tr>
          <th>Name</th>
          <th>Title</th>
          <th>Body</th>
          <th>ID</th>
        </tr>
        {posts.map((post) => (
          <tr>
            <td>{post.user.username}</td>
            <td>{post.title}</td>
            <td>{post.body}</td>
            <td>{post.id}</td>
          </tr>
        ))}
      </table>
      <a href="/">Go Home</a>
    </BaseLayout>
  );
});

postRoutes.get("/create-post", async (c) => {
  const jwtPayload = c.get('jwtPayload');

  const user = jwtPayload && await findUserById(jwtPayload.userId);

  return c.html(
    <SidebarLayout title="Create Post" user={user}>
      <h1 class="title">Create a post</h1>
      <form method="post" action="/create-post">
        <label>
          Title <input id="title" type="text" name="title" required />
        </label>
        <label>
          Body <input id="body" type="text" name="body" required />
        </label>
        <input type="hidden" name="isDraft" value="" />
        <div class="bottom">
          <button type="submit" name="isDraft" value="1">Save as Draft</button>
          <button id="create-btn" type="submit" class="cta">Create Post</button>
        </div>
      </form>
    </SidebarLayout>
  );
});

postRoutes.post("/create-post", async (c) => {
  const parsedBody = await c.req.parseBody();
  const title = parsedBody["title"] as string;
  const isDraft = parsedBody["isDraft"] as string;
  const body = parsedBody["body"] as string;
  const jwtPayload = c.get('jwtPayload');

  if (!jwtPayload) {
    return c.redirect("/create-post");
  }

  await db.insert(postTable).values({
    title,
    body,
    isDraft: Boolean(isDraft),
    userId: jwtPayload.userId,
  });

  return c.redirect("/");
});

export default postRoutes;
