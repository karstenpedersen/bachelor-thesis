import puppeteer from "puppeteer";

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const LOGIN_PAGE_URL = process.env.LOGIN_PAGE_URL;
const HOME_PAGE_URL = process.env.HOME_PAGE_URL;

// CSS selectors for login form elements
const LOGIN_USERNAME_SELECTOR = "#username";
const LOGIN_PASSWORD_SELECTOR = "#password";
const LOGIN_BUTTON_SELECTOR = "#login-btn";

const RELOAD_TIME = 15000; // 15 seconds

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome-stable',
});
const page = await browser.newPage();

// Goto login page
await page.setViewport({
  width: 1080,
  height: 1024,
});
await page.goto(LOGIN_PAGE_URL);

// Fill in username and password
await page.locator(LOGIN_USERNAME_SELECTOR).fill(USERNAME);
await page.locator(LOGIN_PASSWORD_SELECTOR).fill(PASSWORD);
await page.locator(LOGIN_BUTTON_SELECTOR).click();

// Goto home page to render posts
await page.goto(HOME_PAGE_URL);

// Endless loop to reload home page
setInterval(async () => {
  await page.reload();
}, RELOAD_TIME);
