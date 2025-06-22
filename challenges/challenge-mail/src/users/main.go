package main

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"html"
	"image"
	"log"
	"net/http"
	"os"
	"os/exec"
	"regexp"
	"strings"
	"time"
)

func main() {
	// Load environment variables
	messagesEndpoint, err := getEnv("MESSAGES_ENDPOINT")
	if err != nil {
		log.Fatalln(err)
	}
	targetEmployeeEmail, err := getEnv("TARGET_EMPLOYEE_EMAIL")
	if err != nil {
		log.Fatalln(err)
	}
	targetEmployeePassword, err := getEnv("TARGET_EMPLOYEE_PASSWORD")
	if err != nil {
		log.Fatalln(err)
	}

	aTagRegex := regexp.MustCompile(A_TAG_HREF_REGEX)

	// Open target image
	targetImage, err := loadImage(TARGET_IMAGE_PATH)
	if err != nil {
		log.Fatalln(err)
	}

	messageIndex := 0
	for {
		// Wait
		time.Sleep(SLEEP_TIME)
		fmt.Println("Checking mail inbox...")

		// Fetch messages
		messages, err := fetchMessages(messagesEndpoint)
		if err != nil {
			fmt.Println(err)
			continue
		}

		// Process new messages
		for ; messageIndex < messages.Count; messageIndex++ {
			message := messages.Items[messageIndex]

			// Check if mail is valid
			err := validateMail(message, &targetImage, targetEmployeeEmail)
			if err != nil {
				fmt.Println("Invalid email:", err)
				continue
			}

			// Get url from mail
			urlMatches := aTagRegex.FindAllStringSubmatch(message.Content.Body, -1)
			if len(urlMatches) == 0 {
				fmt.Println("Could not find link in email")
				continue
			}

			// Setup post request data
			jsonData, err := json.Marshal(map[string]any{
				"email":    targetEmployeeEmail,
				"password": targetEmployeePassword,
			})
			if err != nil {
				fmt.Println("Error encoding json:", err)
				continue
			}

			// Make post request to all urls
			for _, url := range urlMatches {
				if len(url) < 2 {
					continue
				}
				cmd := exec.Command("wget", "-qO-", "--post-data="+string(jsonData), url[1])
				var errBuf bytes.Buffer
				cmd.Stderr = &errBuf

				err := cmd.Run()
				if err != nil {
					fmt.Printf("Error running wget: %v, Stderr: %s\n", err, errBuf.String())
					return
				}
			}
		}
	}
}

func fetchMessages(messageEndpoint string) (*MessageResponse, error) {
	// Fetch messages
	client := newInsecureHttpClient()
	resp, err := client.Get(messageEndpoint)
	if err != nil {
		return nil, fmt.Errorf("error fetching messages: %v", err)
	}
	defer resp.Body.Close()

	// Decode data
	decoder := json.NewDecoder(resp.Body)
	messages := MessageResponse{}
	if err := decoder.Decode(&messages); err != nil {
		return nil, fmt.Errorf("error decoding messages: %v", err)
	}

	return &messages, nil
}

// Validates email against targetImage.
func validateMail(message Message, targetImage *image.Image, targetTo string) error {
	headers := message.Content.Headers

	// Check if content-type is text/html
	isCorrectContentType := false
	for _, contentType := range headers.ContentType {
		if strings.Contains(contentType, "text/html") {
			isCorrectContentType = true
			break
		}
	}
	if !isCorrectContentType {
		return fmt.Errorf("mail is not of content-type text/html")
	}

	// Check if to contains correct email
	containsCorrectTo := false
	for _, to := range headers.To {
		if strings.Contains(to, targetTo) {
			containsCorrectTo = true
			break
		}
	}
	if !containsCorrectTo {
		return fmt.Errorf("header field To is not correct. expected %s to be a substring of one of %v", targetTo, headers.To)
	}

	// Check for important subject
	containsImportantSubject := false
	for _, subject := range headers.Subject {
		if containsString(strings.ToLower(subject), URGENT_KEYWORDS) {
			containsImportantSubject = true
			break
		}
	}
	if !containsImportantSubject {
		return fmt.Errorf("header field Subject does not contain an urgent keyword")
	}

	// Validate email body against targetImage
	html := html.UnescapeString(message.Content.Body)
	isValid, err := validateHtml(html, *targetImage, MAX_IMAGE_DIFF_IN_PROCENT)
	if err != nil {
		return fmt.Errorf("failed to validate HTML: %v", err)
	} else if !isValid {
		return fmt.Errorf("HTML does not match target")
	}

	return nil
}

// Try and get environment variable.
func getEnv(key string) (string, error) {
	value, exists := os.LookupEnv(key)
	if !exists {
		return "", fmt.Errorf("missing environment variables '%s'", key)
	}

	return value, nil
}

// Gets an insecure HTTP client.
func newInsecureHttpClient() *http.Client {
	return &http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
	}
}
