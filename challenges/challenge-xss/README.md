# Challenge: Chirper

Web security challenge to test the players knowledge on cross site scripting (XSS).

## Services

This challenge sets up a system for a website, Chirp, were users can create and read posts. The following services are the ones setup in the [compose.yaml](./src/compose.yaml) file.

### Website (web)

This is the actual website. Users can create draft posts and make them public later.

### PostgreSQL Database (database)

This is the database in which the data for the users and their posts are stored.

### Admin User (admin-user)

This is the target user that the player needs to get access to. Their account has a draft post where the CTF flag is stored. This service simulates what a user would do. It signs into the website and keeps reloading the home page, waiting for the player to create a post with XSS, so their browser can execute it. This uses Puppeteer so it can render and execute the players XSS attack.

### OpenSSH (openssh)

This service is used by the player to setup a HTTP server which their XSS post will send tokens to.

This service is accessible through `$SSH_SERVICE_INTERNAL_URL:$SSH_PORT` and the username is `gl` and the password is `hf`.

### Healthcheck (healthcheck)

This is a simple server that responds with 'OK' and status code 200. This is used for the CTF platform.

### NGINX (nginx)

This is a reverse proxy to expose `web` and `healthcheck` over port 8080. `web` is accessible on `web.$DOMAIN:$HTTP_PORT` and `healthcheck` is accessible on `$DOMAIN:$HTTP_PORT` directly.

## Vulnerabilities

The system contains specific vulnerabilities that are meant to be exploited by the player:

- Posts are not sanitized when stored or rendered. This makes the system vulnerable to stored XSS attacks.
- The authentication system is token-based and the tokens are transmitted via cookies that are not marked as `httpOnly`. This exposes them to client-side scripting.

These two vulnerabilites allows the player to access other users authentication tokens and thus sign in as them.

## Solution

1. Navigate to the website at `web.$DOMAIN:$HTTP_PORT`.
1. Create a new account.
1. Find out that you can do XSS.
1. SSH into `$SSH_SERVICE_INTERNAL_URL:$SSH_PORT` and setup an HTTP server.
1. Create post that sends other users cookies to HTTP server.
1. Wait for JWT tokens to appear in HTTP server.
1. Copy JWT token and paste it into the browser.
1. Go to drafts page.
1. Find flag on the format `flag{.*}`.

See the automated test in [solution](./solution).

## Development

```bash
# see available recipes
just

# start development
just dev

# run solution
just solution

# bundle challenge for QEMU
just bundle
```

## Read More

- https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS
- https://owasp.org/www-community/Types_of_Cross-Site_Scripting
