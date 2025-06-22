import type { PropsWithChildren } from "hono/jsx";
import BaseLayout from "./BaseLayout.js";
import db from "../db/index.js";
import type { UserSelect } from "../db/types.js";

/**
 * SidebarLayout component props.
 */
type SidebarLayoutProps = {
	title: string;
	user?: UserSelect;
};

/**
 * SidebarLayout component.
 * @component
 */
async function SidebarLayout({
	title,
	user,
	children,
}: PropsWithChildren<SidebarLayoutProps>) {
	const posts = await db.query.postTable.findMany({
		where: (posts, { eq }) => eq(posts.isDraft, false),
	});

	return (
		<BaseLayout title={title}>
			<div class="sidebar-layout">
				{/* Left side */}
				<div class="left-sidebar">
					<nav>
						<a href="/" class="logo">
							<img
								src="/static/pictures/logo.png"
								alt="moodeng"
								style="width:60px; aspect-ratio: 1"
							/>
							Chirp
						</a>

						{user !== undefined ? (
							<>
								<a class="nav-link" href="/">Home</a>
								<a class="nav-link" href="/drafts">Drafts</a>
								<a class="nav-link cta" href="/create-post">New Post</a>
							</>
						) : (
							<>
								<a class="nav-link" href="/">Home</a>
							</>
						)}

						{user !== undefined ? (
							<div class="bottom-nav">
								<p class="nav-text">{user.username}</p>
								<a class="nav-link" href="/logout">Logout</a>
							</div>
						) : (
							<div class="bottom-nav">
								<a class="nav-link" href="/login">Login</a>
								<a class="nav-link" href="/create-account">Create Account</a>
							</div>
						)}
					</nav>
				</div>

				{/* Main */}
				<div class="main-content">{children}</div>

				{/* Right side */}
				<div class="right-sidebar">
					<h3>Trending Posts</h3>
					{posts.length !== 0 ? (
						<ul class="post-links">
							{posts.map((post) => {
								return (
									<a class="post-link" href={`#post-${post.id}`}>
										{post.title}
									</a>
								)
							})}
						</ul>
					) : (<p>No trending posts</p>)}
				</div>
			</div>
		</BaseLayout>
	);
}

export default SidebarLayout;
