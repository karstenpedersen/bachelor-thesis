import BaseLayout from "../components/BaseLayout.js";
import { setCookie } from "hono/cookie";
import bcrypt from "bcrypt";
import { sign } from 'hono/jwt'
import type { JWTPayload } from "../types.js";
import { createUser, findUserByUsername } from "../utils/userUtils.js";
import { createRouter } from "../utils/router.js";

/**
 * Authentication routes.
 */
const authRoutes = createRouter();

let wrongPasswordOrName = false;

authRoutes.post("/create-account", async (c) => {
  const body = await c.req.parseBody();
  const username = body["username"] as string;
  const email = body["email"] as string;
  const password = body["password"] as string;

  try {
    // Try and create new user
    await createUser(username, email, password);
  } catch (err) {
    wrongPasswordOrName = true
    console.log(err);
    return c.redirect("/create-account");
  }

  return c.redirect("/login");
});

authRoutes.get("/create-account", (c) => {
  return c.html(
    <BaseLayout title="Create Account">
      <div class="authstyle">
        <h1>Create an Account</h1>
        <form method="post" action="/create-account">
          <label>
            Username <input id="username" type="text" name="username" required />
          </label>
          <label>
            Email <input id="email" type="text" name="email" required />
          </label>
          <label>
            Password{" "}
            <input id="password" type="password" name="password" required />
          </label>
          <button id="login-btn" type="submit">Create Account</button>
        </form>
        <div class="auth-footer">
          {getwrongPasswordOrName() ? (
            <b style="color:tomato;">The username is invalid</b>
          ) : (<p> </p>)}
          <p>
            Already have an account? <a href="/login">Login Here</a>
          </p>
          <p>
            Go to home page <a href="/">Home Page</a>
          </p>
        </div>
      </div>
    </BaseLayout>
  );
});

authRoutes.post("/login", async (c) => {
  const formData = await c.req.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const user = await findUserByUsername(username);
    
  // Validate password
  let match = false;
  if (user !== undefined) {
    // Check password hash
    match = await bcrypt.compare(password, user.password);
  }
  if (user === undefined || !match) {
    wrongPasswordOrName = true;
    return c.redirect("/login")
  }

  // Setup JWT cookie
  const payload: JWTPayload = {
    userId: user.id,
    // exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
  }
  const secret = process.env.JWT_SECRET ?? 'mySecretKey';
  const jwtToken = await sign(payload, secret);
  setCookie(c, 'jwt', jwtToken);

  return c.redirect("/");
});

authRoutes.get("/login", (c) => {
  return c.html(
    <BaseLayout title="Login">
      <div class="authstyle">
        <h1>Login</h1>
        <form method="post" action="/login">
          <label>
            Username: <input id="username" type="text" name="username" required />
          </label>
          <label>
            Password: <input id="password" type="password" name="password" required />
          </label>
          <button id="login-btn" type="submit">Login</button>
        </form>
        {getwrongPasswordOrName() ? (
          <b style="color:tomato;">The password or username is invalid</b>
        ) : (<p> </p>)}
        <div class="auth-footer">
          <p>
            Don't have an account? <a href="/create-account">Create one here</a>
          </p>
          <p>
            Go to home page <a href="/">Home page</a>
          </p>
        </div>
      </div>
    </BaseLayout>
  );
});

//  help funktion for toggeling the variebel wrongPasswordOrName when it is used 
function getwrongPasswordOrName(): boolean {
  if (wrongPasswordOrName == true) {
    wrongPasswordOrName = false
    return true;
  }
  return false;
};

export default authRoutes;
