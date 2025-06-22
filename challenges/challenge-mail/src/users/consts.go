package main

import "time"

const (
	// Time to sleep between checking inbox.
	SLEEP_TIME = 5 * time.Second
	// Threshold for difference between images.
	MAX_IMAGE_DIFF_IN_PROCENT float32 = 25
	// Path to target image.
	TARGET_IMAGE_PATH = "./assets/mail.png"
	// Regex to recognize a tags.
	A_TAG_HREF_REGEX = `<a[^>]+href="([^"]+)"`
)

// Urgent keyword list.
var URGENT_KEYWORDS = []string{
	"urgent",
	"immediate",
	"asap",
	"critical",
	"important",
	"alert",
	"pressing",
	"crucial",
	"serious",
	"grave",
	"instant",
	"imperative",
	"compelling",
	"exigent",
	"great",
	"password",
}
