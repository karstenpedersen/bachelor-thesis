package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

// Data for pages.
var data = map[string]any{}

func main() {
	companyName, err := getEnv("COMPANY_NAME")
	if err != nil {
		log.Fatalln(err)
	}
	companyDomain, err := getEnv("COMPANY_DOMAIN")
	if err != nil {
		log.Fatalln(err)
	}
	employeeName, err := getEnv("EMPLOYEE_NAME")
	if err != nil {
		log.Fatalln(err)
	}
	employeeEmail, err := getEnv("EMPLOYEE_EMAIL")
	if err != nil {
		log.Fatalln(err)
	}

	data = map[string]any{
		"CompanyName":   companyName,
		"CompanyDomain": companyDomain,
		"EmployeeName":  employeeName,
		"EmployeeEmail": employeeEmail,
	}

	port, exists := os.LookupEnv("PORT")
	if !exists {
		port = "3000"
	}

	// Static files
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Pages
	http.HandleFunc("/", homeHandler)
	http.HandleFunc("/about", aboutHandler)
	http.HandleFunc("/services", servicesHandler)

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalln(err)
	}
}

// Handler for home page.
func homeHandler(w http.ResponseWriter, r *http.Request) {
	parsePage(&w, "index.html", data)
}

// Handler for about page.
func aboutHandler(w http.ResponseWriter, r *http.Request) {
	parsePage(&w, "about.html", data)
}

// Handler for services page.
func servicesHandler(w http.ResponseWriter, r *http.Request) {
	parsePage(&w, "services.html", data)
}

// parsePage parses HTML pages and applies templates.
func parsePage(w *http.ResponseWriter, page string, data any) {
	lp := filepath.Join("templates", "layout.html")
	fp := filepath.Join("pages", page)

	// Parse files
	tmpl, err := template.ParseFiles(lp, fp)
	if err != nil {
		log.Print(err)
		http.Error(*w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// Execute template
	err = tmpl.ExecuteTemplate(*w, "layout", data)
	if err != nil {
		log.Print(err)
		http.Error(*w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
	}
}

// Try and get environment variable.
func getEnv(key string) (string, error) {
	value, exists := os.LookupEnv(key)
	if !exists {
		return "", fmt.Errorf("missing environment variables '%s'", key)
	}

	return value, nil
}
