# bachelor-thesis

Bachelor thesis project for the [BADM500 course](https://odin.sdu.dk/sitecore/index.php?a=searchfagbesk&internkode=badm500&lang=en) (2025) at the [University of Southern Denmark](https://www.sdu.dk/en), [Department of Mathematics and Computer Science](https://www.sdu.dk/en/om-sdu/institutter-centre/imada_matematik_og_datalogi).

The project explores Capture the Flag (CTF) challenges and how they can help educate people about subjects in computer science and cybersecurity.

The challenges were created for the CTF platform: https://github.com/KianBankeLarsen/CTF-Platform.

## Challenges

1. [challenge-xss](./challenges/challenge-xss/): Cross site scripting (XSS) challenge.
2. [challenge-blog](./challenges/challenge-blog/): Open-source intelligence (OSINT) challenge.
3. [challenge-mail](./challenges/challenge-mail/): Phishing attack challenge.
4. [challenge-pwn](./challenges/challenge-pwn/): Pwn challenge.
5. [challenge-maze](./challenges/challenge-maze/): Maze game challenge.
5. [template](./challenges/template/): Template challenge. Copy this when creating new challenges.

## Prerequisites

You need the following programs on your machine:

- [QEMU](https://www.qemu.org)
- [Python](https://www.python.org)
- [just](https://github.com/casey/just)
- [zip](https://infozip.sourceforge.net)

You can also get these by using the provided [flake.nix](./flake.nix) file. [Read more about flakes](https://nixos.wiki/wiki/Flakes).

## Getting Started

### Download Virtual Machine Image

Download the [VM file](https://drive.google.com/file/d/15oGi7wfHXGdRP8Wk3V1T9C3243ypQxHd/view?usp=sharing) and copy it to the root folder of the project.

### Run CTF Challenges

```bash
# list available recipes
just

# list available CTF challenges
just challenges

# run CTF challenge in QEMU
just run <challenge>

# run CTF challenge in development mode
just dev <challenge>

# run CTF challenge solution
just solution <challenge>
```

The username and password for the VM are the following:

- Username: alpine
- Password: password

Exit the VM by pressing `Ctrl-a` followed by `x`.

### Failure Starting HTTP Server

If something fails, then the Python HTTP server might not shut down properly. You will need to kill the process yourself, which can be done like this:

```bash
# see processes
ps

# find the Python process and copy its PID

# kill the process
kill <pid>
```

You can now try and rerun the CTF challenge.

## Creating New Challenges

Copy the [template](./challenges/template) challenge to the [challenges](./challenges) directory.

```bash
cp challenges/template challenges/<challenge>
```

Start developing :D

## Project Group

This project was developed by the following group members:

- Esben Kylling Petersen
- Karsten Finderup Pedersen
- Tobias Samsøe Sørensen
- Yannick Gennadij Nustajev Mikkelsen

Thanks to our supervisor [Jacopo Mauro](https://jacopomauro.com/).
