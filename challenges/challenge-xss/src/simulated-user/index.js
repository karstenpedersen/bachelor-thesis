import puppeteer from "puppeteer";

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const LOGIN_PAGE_URL = process.env.LOGIN_PAGE_URL;

// CSS selectors for login form elements
const LOGIN_USERNAME_SELECTOR = "#username";
const LOGIN_PASSWORD_SELECTOR = "#password";
const LOGIN_BUTTON_SELECTOR = "#login-btn";

const RELOAD_TIME_IN_MS = 15000; // 15 seconds
const WAIT_TIME_IN_MS = 5000; // 5 seconds

// Setup Puppeteer
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome-stable',
});
const page = await browser.newPage();

// Try and login
while (true) {
  try {
    console.log(`Go to '${LOGIN_PAGE_URL}'`);
    await page.goto(LOGIN_PAGE_URL);

    // Fill in username and password
    await page.locator(LOGIN_USERNAME_SELECTOR).fill(USERNAME);
    await page.locator(LOGIN_PASSWORD_SELECTOR).fill(PASSWORD);
    await page.locator(LOGIN_BUTTON_SELECTOR).click();

    // Wait for login to redirect
    await page.waitForNavigation();

    break;
  } catch (err) {
    console.log(`Failed to go to '${LOGIN_PAGE_URL}'. Waiting for ${WAIT_TIME_IN_MS}ms until trying again.`);
    console.error(err);
    await new Promise(resolve => setTimeout(resolve, WAIT_TIME_IN_MS));
  }
}

// Keep reloading home page
while (true) {
  try {
    const cookie = await browser.cookies()
    console.log(`Reload page: '${page.url()}'`);
    await page.reload();
  } catch (err) {
    console.log(`Failed to reload page '${page.url()}'`);
    console.error(err);
  }

  await new Promise(resolve => setTimeout(resolve, RELOAD_TIME_IN_MS));
}
