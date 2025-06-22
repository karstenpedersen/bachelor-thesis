# Challenge: Maze Game

Capture the flag challenge to test the players knowledge on breadth-first search (BFS).

## Services

This challenge sets up a playable game were the player has to escape a maze. The maze has a limited search space.

### Maze Game (chall)

This is the actual game. The player can play it by giving input commands like `L` and `R` for going left and right and `b` for going back to the start. The following services are the ones setup in the [compose.yaml](./src/compose.yaml) file.

### Healthcheck (healthcheck)

This is a simple server that responds with 'OK' and status code 200. This is used for the CTF platform. This is directly accessible on `$DOMAIN:$HTTP_PORT`.

### OpenSSH (openssh)

This service is used by the player to access `chall` (the Maze Game).

It is accessible through `$SSH_SERVICE_INTERNAL_URL:$SSH_PORT` and the username is `test` and the password is `test`.

## Solution

To solve the challenge, the player must write a script that explores all possible paths in the maze using a Breadth-First Search (BFS) algorithm. The script should generate all combinations of characters needed to traverse the maze, sending input one character at a time to the game, until the correct path is found and the maze is completed.

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

### Connect to the Challenge

```bash
# Step 1: SSH into the system
ssh test@localhost -p 8022

# Step 2: Use netcat to access maze game
nc chall 1337
```