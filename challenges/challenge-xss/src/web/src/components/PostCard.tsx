import type { PropsWithChildren } from "hono/jsx";
import { getUserDisplayName } from "../utils/userUtils.js";
import type { PostSelect } from "../db/types.js";
import db from "../db/index.js";

/**
 * PostCard component props.
 */
type PostCardProps = {
  post: PostSelect
};

/**
 * PostCard component.
 * @component
 */
async function PostCard({ post }: PropsWithChildren<PostCardProps>) {
  const user = await db.query.userTable.findFirst({
    where: (users, { eq }) => eq(users.id, post.userId),
  });

  // Render nothing if db fails to fetch user
  if (!user) {
    return <></>
  }
  
  const displayName = getUserDisplayName(user);

  return (
    <div class="post-card" id={`post-${post.id}`}>
      <div class="post-header">
        <h3 class="post-title">{post.title}</h3>
        <div class="post-name">
          <p class="display-name">{displayName}</p>
          <hr />
          <p class="username">@{user.username}</p>
        </div>
      </div>
      <div class="post-body">
        {/* I found this cool attribute to set the body exactly how i want it! */}
        <p dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
      {post.isDraft ? (
        <a class="post-edit" href={`/draftedit/${post.id}`}>Edit</a>
      ) : (
        <></>
      )}
    </div>
  );
}

export default PostCard;
