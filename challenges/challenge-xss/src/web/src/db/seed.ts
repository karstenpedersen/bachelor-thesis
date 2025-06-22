import { createPost } from "../utils/postUtils.js";
import { createMockUser, createUser } from "../utils/userUtils.js";

/**
 * Seeds the database with users and posts.
 */
async function seed() {
  // Users
  const admin = await createUser(process.env.ADMIN_USERNAME ?? "admin", "admin@email.com", process.env.ADMIN_PASSWORD ?? "admin", true);
  const bob = await createUser("Bob", "bob@email.com", "1234");
  const charlie = await createMockUser("Charlie");
  const diana = await createMockUser("Diana");
  const emilie = await createMockUser("Emilie");
  const henning = await createMockUser("Henning");
  const steve = await createMockUser("Steve");

  // Posts
  createPost({
    userId: admin,
    title: "Hello, World!",
    body: "Welcome to my website :D",
  });

  createPost({
    userId: admin,
    title: "My Love for Flags",
    body: process.env.CTF_FLAG ?? "",
    isDraft: true,
  });

  createPost({
    userId: bob,
    title: "Very Cool Website",
    body: `This is a very cool website ${process.env.ADMIN_USERNAME}.`,
  });

  createPost({
    userId: bob,
    title: "Certified hater",
    body: "I am starting to hate on the word hate",
    isDraft: true,
  });

  createPost({
    userId: charlie,
    title: "Learning Javascripts",
    body: "I just started learning JS. Any tips?",
  });

  createPost({
    userId: diana,
    title: "Thanks for making me a moderator",
    body: "I can't wait to help make this community a better place :D",
  });

  createPost({
    userId: admin,
    title: "My Love for Cats",
    body: "I love cats",
  });

  createPost({
    userId: diana,
    title: "Recent Thoughts",
    body: "I thought about quitting being an admin, this job is just not for me anymore. Too many regulations (╯‵□′)╯︵┻━┻",
  });

  createPost({
    userId: emilie,
    title: "New in Town",
    body: "Hey folks! I am new here :)",
  });

  createPost({
    userId: charlie,
    title: "Party Tonight?",
    body: "Hey, are there anybody throwing a rager tonight?",
  });

  createPost({
    userId: diana,
    title: "Church Saturday!",
    body: "Hello everybody, i would like to remind you that the church has an additional prayer this saturday",
  });

  createPost({
    userId: emilie,
    title: "IT-day",
    body: "Did anybody else get free redbulls from IT-day?",
  });

  createPost({
    userId: bob,
    title: "A Minecraft Review",
    body: "THIS WAS THE BEST MOVIE EVER, THE FLINT, THE STEEL, THE MINECRAFT, EVERYTHING WAS PERFECT!",
  });

  createPost({
    userId: henning,
    title: "Hi there",
    body: "Anybody who would be interested in starting a Lol (league of legends) team with me?",
  });

  createPost({
    userId: steve,
    title: "I... AM... STEVE",
    body: "As a child, I yearned for the mines",
  });

  createPost({
    userId: emilie,
    title: "RE: Hi there",
    body: "Hey @henning, I would like to try out for the team. I only play Jinx from arcane :)))",
  });

}


export default seed;
