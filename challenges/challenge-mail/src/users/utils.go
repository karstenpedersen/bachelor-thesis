package main

import (
	"image"
	"os"
	"strings"
)

// Checks if s contains any string from substrs.
func containsString(s string, substrs []string) bool {
	for _, str := range substrs {
		if strings.Contains(s, str) {
			return true
		}
	}
	return false
}

// Load image file.
func loadImage(name string) (image.Image, error) {
	file, err := os.Open(name)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	image, _, err := image.Decode(file)
	if err != nil {
		return nil, err
	}

	return image, nil
}
