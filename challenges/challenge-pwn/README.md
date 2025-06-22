# Challenge: Pwnfish
This challenge revolves around exploiting a vulnerable fishing game written in C.

## Services

### OpenSSH (openssh-server)
This service is used by the player to access the internal network
and from there they can access the remote server where the game is served.

Internally the SSH server is accessible with
```
ssh gl@$SSH_SERVICE_INTERNAL -p 8022
```
and the password is `hf`. Note that `$SSH_SERVICE_INTERNAL` is set to `localhost` when running locally.

When the service is running on the CTF platform, you can connect to the SSH server
by following the directions on https://ctf.jacopomauro.com/.


### Pwnfish (pwnfish)

This service listens to connections on port 1337,
and serves the pwnfish game.

Once connected to the SSH server, you can connect to the game with
```
nc pwnfish 1337
```

### Healthcheck (healthcheck)

This is a simple server that responds with 'OK' and status code 200. This is used for the CTF platform.


## Vulnerabilities

There are several implementation mistakes in the source code (`main.c`).

Firstly, the program uses `scanf("%s", buf)` to get input, without limiting the input length.
Therefore, it is possible to overflow buffers and control unintended memory areas.

There are a number of security protections compiled into the binary,
making it harder to exploit, including:
- PIE
- Stack canary
- No execution of stack memory
- RELRO

and ASLR is also enabled on the remote server.


Furthermore, another mistake is a format string vulnerability.
Using `printf(buf)` instead of `print("%s", buf)` makes it
possible to leak values of registers and the stack.
This can be used to thwart the various protections mentioned above.


## Solution
The player can exploit the format string vulnerability to 
leak a known address off the stack, and can then compute the PIE base address.

Then the player can use the format string to leak entries in the Global Offset Table, 
and then find the base address of libc.

The stack canary can also be leaked with the format string.

The stack can now be overflowed with a payload that
preserves the stack canary, and starts a ROP chain at the
saved instruction pointer on the stack.
Since the exact libc is provided in the handout, the player
can find the address of `system` and call `system('/bin/sh')` 
to spawn a shell on the remote server, and then read the flag
with `cat flag`.

