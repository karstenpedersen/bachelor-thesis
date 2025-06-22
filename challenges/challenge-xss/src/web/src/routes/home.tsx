import db from "../db/index.js";
import SidebarLayout from "../components/SidebarLayout.js";
import PostCard from "../components/PostCard.js";
import { findUserById } from "../utils/userUtils.js";
import { createRouter } from "../utils/router.js";

/**
 * Home route.
 */
const homeRoutes = createRouter();

homeRoutes.get("/", async (c) => {
  const jwtPayload = c.get('jwtPayload');

  const user = jwtPayload && await findUserById(jwtPayload.userId);
  
  const posts = await db.query.postTable.findMany({
    where: (posts, { eq }) => eq(posts.isDraft, false),
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  });
  
  return c.html(
    <SidebarLayout title="Home" user={user}>
      <h1 class="title">Home</h1>
      {posts.length !== 0 ? (
        posts.map((post) =>
          <PostCard post={post} />
        )) :
        (
          <p>No posts yet!</p>
        )}
    </SidebarLayout>
  );
});

export default homeRoutes;
