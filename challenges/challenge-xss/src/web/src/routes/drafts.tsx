import db from '../db/index.js';
import PostCard from '../components/PostCard.js';
import SidebarLayout from '../components/SidebarLayout.js';
import { StatusCodes } from 'http-status-codes';
import { findUserById } from '../utils/userUtils.js';
import { findPostById } from '../utils/postUtils.js';
import { postTable } from '../db/schema.js';
import { createRouter } from '../utils/router.js';
import { eq } from 'drizzle-orm';

/**
 * Draft routes.
 */
const draftsRoutes = createRouter();

draftsRoutes.get('/drafts', async (c) => {
	const jwtPayload = c.get('jwtPayload');

	if (!jwtPayload) {
		return c.html(
			<>
				<h1>Error: Unauthorized Access</h1>
				<p>You do not have permission to view this content.</p>
			</>,
			StatusCodes.FORBIDDEN
		);
	}

	const user = await findUserById(jwtPayload.userId);

	const drafts = await db.query.postTable.findMany({
		where: (posts, { and, eq }) => and(eq(posts.userId, jwtPayload.userId), eq(posts.isDraft, true)),
	});

	return c.html(
		<SidebarLayout title="Home" user={user}>
			<h1 class="title">Drafts</h1>
			{drafts.length !== 0 ? (
				drafts.map((post) => {
					return (
						<PostCard post={post} />
					);
				})) : (
				<p>You have no drafts!</p>
			)}
		</SidebarLayout>
	);
});

draftsRoutes.get('/draftedit/:id', async (c) => {
	const jwtPayload = c.get('jwtPayload');
	const postId = c.req.param('id');

	const post = await findPostById(Number(postId));

	if (!jwtPayload || !post || jwtPayload.userId != post.userId) {
		return c.html(
			<>
				<h1>Error: Unauthorized Access</h1>
				<p>You do not have permission to view this content.</p>
			</>,
			StatusCodes.FORBIDDEN
		);
	}

	const user = await findUserById(jwtPayload.userId);

	return c.html(
		<SidebarLayout title="Create Post" user={user}>
			<h1 class="title">Create a post</h1>
			<form method="post" action="/create-draft">
				<label>
					Title <input type="text" name="title" value={post.title} required />
				</label>
				<label>
					Body <input type="text" name="body" value={post.body} required />
				</label>
				<input type="hidden" name="isDraft" value="" />
				<input type="hidden" name="id" value={post.id} />
        <div class="bottom">
					<button type="submit" name="isDraft" value="1">Save as Draft</button>
					<button class="cta" type="submit">Create post</button>
				</div>
			</form>
		</SidebarLayout>)
});

draftsRoutes.post("/create-draft", async (c) => {
	const parsedBody = await c.req.parseBody();
	const title = parsedBody["title"] as string;
	const isDraft = parsedBody["isDraft"] as string;
	const body = parsedBody["body"] as string;
	const postId = parsedBody["id"] as string
	const jwtPayload = c.get('jwtPayload');
	const post = await findPostById(Number(postId));

	// Check if user has access to updating the post
	if (!jwtPayload || !post || jwtPayload.userId != post.userId || !post.isDraft) {
		return c.html(
			<>
				<h1>Error: Unauthorized Access</h1>
				<p>You do not have permission to view this content.</p>
			</>,
			StatusCodes.FORBIDDEN
		);
	}

	await db.update(postTable).set({
		title,
		body,
		isDraft: Boolean(isDraft)
	}).where(eq(postTable.id, Number(postId)));

	return c.redirect("/");
});

export default draftsRoutes;
