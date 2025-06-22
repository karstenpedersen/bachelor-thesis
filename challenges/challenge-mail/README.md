# Challenge: You've Got Mail

Capture the flag challenge to test the players knowledge about phishing attacks.

## Services

This challenge sets up an email system, a fictional company website, and simulated company employees that each have an email account. The following services are the ones setup in the [compose.yaml](./src/compose.yaml) file.

### Company Website (company)

This is the website where the user can find emails of the company's employees.

### Mail Server (mailserver)

This is the mail system. This is done using [MailHog](https://github.com/mailhog/MailHog).

- The player can send emails to `mailserver:1025` from inside `openssh-server` using `mhsendmail`.
- The player can see what mails they have sent to the system on `mail.$DOMAIN:$HTTP_PORT`.

### Users (users)

This is the simulated user the player needs to attack.

### Healthcheck (healthcheck)

This is a simple server that responds with 'OK' and status code 200. This is used for the CTF platform.

### OpenSSH (openssh)

This service is used by the player to setup a HTTP server for their phishing email, and also send it using `mhsendmail` to SMTP endpoint: `mailserver:1025`.

This service is accessible through `$SSH_SERVICE_INTERNAL_URL:$SSH_PORT` and the username is `gl` and the password is `hf`.

### NGINX (nginx)

This is a reverse proxy to expose `company`, `mailserver` and `healthcheck`. `company` is accessible on `company.$DOMAIN:$HTTP_PORT`, `mailserver` UI is accessible on `mail.$DOMAIN:$HTTP_PORT` and `healthcheck` is accessible on `$DOMAIN:$HTTP_PORT` directly.

## Vulnerabilities

- One of the company employees are not good at IT, and can therefore be deceived to click on phishing emails.

## Solution

1. Navigate to the website at `company.$DOMAIN:$HTTP_PORT`.
1. Find the least tech-savvy employee.
1. SSH into `$SSH_SERVICE_INTERNAL_URL:$SSH_PORT` and start a HTTP server that accepts POST requests.
1. Recreate the given email and add the link to your HTTP server.
1. Send the email from the SSH server using `mhsendmail` at `mailserver:1025`.
1. If you have send the email to the correct employee and log out the body of the responses, then you should see the employee's login credentials.

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

- https://github.com/mailhog/MailHog
