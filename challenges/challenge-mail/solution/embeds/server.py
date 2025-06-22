from http.server import BaseHTTPRequestHandler, HTTPServer

port = {{PORT}}
log_file = {{LOG_FILE}}


class ServerHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        response_body = b'{}'
        response_length = len(response_body)
        response_code = 200

        try:
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length).decode("utf-8")
            with open(log_file, 'a') as f:
                f.write(post_data)
            with open("CLONE.txt", 'a') as f:
                f.write(str(content_length))
                f.write(post_data)
                f.write(str(self.headers))
        except Exception as e:
            response_code = 500
            with open("error.log", "a") as f:
                f.write(str(e))

        self.send_response(response_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(response_length))
        self.end_headers()
        self.wfile.write(response_body)
        

def run(server_class=HTTPServer, handler_class=ServerHandler, port=8080):
    server_address = ("0.0.0.0", port)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()


if __name__ == "__main__":
    run(port=port)
