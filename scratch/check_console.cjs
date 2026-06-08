const puppeteer = require('puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  page.on('console', msg => {
    console.log(`[CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[PAGE ERROR]`, err);
  });

  page.on('requestfailed', request => {
    console.error(`[REQUEST FAILED] ${request.url()} - ${request.failure().errorText}`);
  });

  console.log("Navigating to http://localhost:5176/ ...");
  try {
    await page.goto('http://localhost:5176/', { waitUntil: 'networkidle2', timeout: 15000 });
    console.log("Page loaded. Waiting 8 seconds for all logs...");
    await new Promise(resolve => setTimeout(resolve, 8000));
  } catch (err) {
    console.error("Navigation error:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
})();
