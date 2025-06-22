#include <stdio.h>

#define SPECIES_COUNT 3
#define MAX_NAME_LENGTH 32

typedef enum { BASS, CARP, TROUT } species_t;
char const *const species_names[] = {
    "Bass",
    "Carp",
    "Trout",
};

typedef struct fish_t fish_t;
struct fish_t {
    char name[MAX_NAME_LENGTH];
    fish_t *next;
    species_t species;
};

// Credit: https://www.asciiart.eu/animals/fish
void print_bass() {
    printf("\
 o\n\
o      ______/~/~/~/__           /((\n\
  o  // __            ====__    /_((\n\
 o  //  @))       ))))      ===/__((\n\
    ))           )))))))        __((\n\
    \\\\     \\)     ))))    __===\\ _((\n\
     \\\\_______________====      \\_((\n\
                                 \\((\n");
}

void print_carp() {
    printf("\
     ______\n\
|\\  /      \\\n\
| \\/      o \\\n\
| /\\       -/\n\
|/  \\______/\n");
}

// Credit: https://www.asciiart.eu/animals/fish
void print_trout() {
    printf("\
   ___   ___\n\
  /  _   _  \\\n\
    / \\ / \\\n\
   |   |   |    |\\\n\
   |O  |O  |___/  \\\n\
    \\_/ \\_/    \\   |\n\
  _/      __    \\  \\\n\
 (________/ __   |_/\n\
   (___      /   |    |\\\n\
     \\     \\|    |___/  |\n\
      \\_________      _/\n\
                 \\    |\n\
                 |   /\n\
                /__/\n");
}

void print_species(species_t species) {
    printf("\n");
    switch (species) {
    case BASS:
        print_bass();
        break;
    case CARP:
        print_carp();
        break;
    case TROUT:
        print_trout();
        break;
    }
}
