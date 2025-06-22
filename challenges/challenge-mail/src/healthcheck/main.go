package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	port, exists := os.LookupEnv("PORT")
	if !exists {
		log.Fatalln("Missing environment variable 'PORT'")
	}

	http.HandleFunc("/", handler)

	fmt.Println("Starting server on", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalln(err)
	}
}

// Handles healthcheck endpoint.
func handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain")
	fmt.Fprintln(w, "OK")
}
