#include "fish_t.h"
#include <ctype.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

fish_t *head = NULL;

void free_list(fish_t *node) {
    if (node == NULL) {
        return;
    }
    free_list(node->next);
    free(node);
}

void quit_game(int exit_code) {
    free_list(head);
    exit(exit_code);
}

fish_t *new_fish() {
    fish_t *new = malloc(sizeof(fish_t));
    if (new == NULL) {
        fprintf(stderr, "Error allocating fish\n");
        quit_game(-1);
    }
    new->next = head;
    head = new;
    return new;
}

// Return random integer in the range [0, n-1] (not uniform)
int randint(int n) { return rand() % n; }

void catch_fish() {
    species_t species = (species_t)randint(SPECIES_COUNT);
    printf("You caught a %s!", species_names[species]);
    print_species(species);

    fish_t *fish = new_fish();
    fish->species = species;

    printf("Name your new pet: ");
    scanf("%s", fish->name);
}

void show_fish() {
    char name[MAX_NAME_LENGTH];
    printf("Enter name of fish: ");
    scanf("%s", name);
    printf("\n");

    fish_t *curr = head;
    while (curr != NULL) {
        if (strcmp(name, curr->name) == 0) {
            printf(curr->name);
            print_species(curr->species);
            printf("Species: %s\n", species_names[curr->species]);
            printf("\n");
            break;
        }
        curr = curr->next;
    }
}

void list_names() {
    fish_t *curr = head;
    while (curr != NULL) {
        printf("%s\n", curr->name);
        curr = curr->next;
    }
}

void release_fish() {
    char name[MAX_NAME_LENGTH];
    printf("Enter name of fish: ");
    scanf("%s", name);
    printf("\n");

    fish_t *prev = NULL;
    fish_t *curr = head;
    bool found = false;
    while (curr != NULL) {
        if (strcmp(name, curr->name) == 0) {
            // Remove matching fish
            if (prev == NULL) {
                // Remove head
                head = curr->next;
            } else {
                prev->next = curr->next;
            }
            free(curr);
            found = true;
            break;
        } else {
            prev = curr;
            curr = curr->next;
        }
    }
    if (found) {
        printf("Released: %s\n", name);
    } else {
        printf("Fish not found: %s\n", name);
    }
}

void menu() {
    printf("\nOptions:\n");
    printf("1 - Catch a fish\n");
    printf("2 - Show pet fish\n");
    printf("3 - List fish names\n");
    printf("4 - Release a fish\n");
    printf("5 - Exit\n");
    printf("> ");

    int choice;
    do {
        // Get rid of whitespace
        choice = getchar();
    } while (!isalnum(choice));

    if (choice == EOF) {
        quit_game(0);
    }

    printf("\n");
    switch (choice) {
    case '1':
        catch_fish();
        break;
    case '2':
        show_fish();
        break;
    case '3':
        list_names();
        break;
    case '4':
        release_fish();
        break;
    case '5':
        quit_game(0);
        break;
    default:
        printf("Invalid choice\n");
        break;
    }
}

int main(void) {
    // Prevent buffering
    setvbuf(stdin, NULL, _IOLBF, 0);
    setvbuf(stdout, NULL, _IOLBF, 0);
    setvbuf(stderr, NULL, _IOLBF, 0);

    printf("\nWelcome to Fishing Paradise!\n");

    while (1) {
        menu();
    }

    return 0;
}
