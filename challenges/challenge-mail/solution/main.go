package main

import (
	_ "embed"
	"fmt"
	"os"
	"time"
)

const (
	// Path to output path for the CTF flag.
	CTF_FLAG_OUTPUT_PATH = "/run/solution/flag.txt"
	// Username for SSH system.
	SSH_USERNAME = "gl"
	// Password for SSH system. This is also given to the player,
	// so it is okay that it is hardcoded here.
	SSH_PASSWORD = "hf"
	// The sender of the phishing email.
	EMAIL_FROM_W_NAME = "Alice <alice@mailhog.local>"
	// The receiver of the phishing email.
	EMAIL_TO_W_NAME = "John <john@meridiancorp.com>"
	// The receivers email.
	EMAIL_TO = "john@meridiancorp.com"
	// The phishing email's subject.
	EMAIL_SUBJECT = "Important mail"
	// Address to SMTP endpoint.
	SMTP_ENDPOINT = "mailserver:1025"
	// Regex to recognize CTF flag.
	FLAG_REGEX = "flag{[^}]*}"
	// Command to get IP address.
	GET_IP_COMMAND = "ifconfig eth0 | awk -F'[: ]+' '/inet / {print $4}'"
	// File to log interactions on the HTTP server to.
	HTTP_SERVER_LOG = "challenge.log"
	// Port for the HTTP server.
	HTTP_SERVER_PORT = 5555
	// Filename of HTTP server code.
	HTTP_FILE = "server.py"
	// Time between checking for flag.
	SLEEP_TIME = 5 * time.Second
	// Subdomain for company website.
	COMPANY_WEBSITE_SUBDOMAIN = "company"
)

// Embed phishing email content.
//
//go:embed embeds/mail.html
var mailContent string

// Embed HTTP server code.
//
//go:embed embeds/server.py
var pyHttpServer string

func main() {
	fmt.Println("Solution started")

	solver, err := NewSolver()
	if err != nil {
		fatal(err)
	}
	defer solver.Close()

	// Check that company website contains employee email
	if err := solver.CheckCompanyWebsiteHasEmployeeEmail(); err != nil {
		fatal(err)
	}
	fmt.Println("Found employee email:", EMAIL_TO)

	// Get address of SSH
	address, err := solver.GetHttpServerAddress()
	if err != nil {
		fatal(err)
	}
	fmt.Println("Got HTTP server address:", address)

	// Add HTTP server code to SSH machine
	if err := solver.CreateHttpServer(); err != nil {
		fatal(err)
	}
	fmt.Println("Created HTTP server file")

	// Start HTTP server
	pid, err := solver.StartHttpServer()
	if err != nil {
		fatal(err)
	}
	fmt.Println("Started HTTP server: Pid:", pid)
	solver.httpServerPid = pid

	// Send phishing mail
	mail := createMail(EMAIL_FROM_W_NAME, EMAIL_TO_W_NAME, EMAIL_SUBJECT, mailContent, address)
	if err := solver.SendMail(mail); err != nil {
		fatal(err)
	}
	fmt.Printf("Send email from '%s' to '%s'\n", EMAIL_FROM_W_NAME, EMAIL_TO_W_NAME)

	// Listen for server log in HTTP server
	flag, err := solver.ListenForFlag()
	if err != nil {
		fatal(err)
	}
	fmt.Println("Found flag:", flag)

	// Write flag to output path
	if err := os.WriteFile(CTF_FLAG_OUTPUT_PATH, []byte(flag), 0750); err != nil {
		fatal(err)
	}

	fmt.Println("Test: Succeeded")
}

func fatal(err error) {
	fmt.Printf("Test: Failed\n%s\n", err)
	os.Exit(1)
}
