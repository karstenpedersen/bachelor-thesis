CC = gcc
CFLAGS = -std=c11 -Wall -Wextra

BINARY = ./build/pwnfish

$(BINARY): main.c fish_t.h
	$(CC) $(CFLAGS) -o $@ $^
	cp $(BINARY) ../../solution/
	cp $(BINARY) main.c fish_t.h ../../handout/

.PHONY = clean, run

clean:
	rm $(BINARY)

run: $(BINARY)
	$(BINARY)
