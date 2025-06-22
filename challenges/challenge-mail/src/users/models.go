package main

// Message content headers from MailHog.
type MessageContentHeaders struct {
	ContentType []string `json:"Content-Type"`
	From        []string `json:"From"`
	To          []string `json:"To"`
	Subject     []string `json:"Subject"`
}

// Message content from MailHog.
type MessageContent struct {
	Headers MessageContentHeaders `json:"Headers"`
	Body    string                `json:"Body"`
}

// Message from MailHog.
type Message struct {
	Content MessageContent `json:"Content"`
}

// Messages response from MailHog.
type MessageResponse struct {
	Count int       `json:"count"`
	Items []Message `json:"items"`
}
