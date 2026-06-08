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
    console.log(`[CONSOLE LOG] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[PAGE ERROR]`, err);
  });

  console.log("Navigating to http://localhost:5176/ ...");
  try {
    await page.goto('http://localhost:5176/', { waitUntil: 'networkidle2', timeout: 15000 });
    console.log("Page loaded. Waiting 6 seconds...");
    await new Promise(resolve => setTimeout(resolve, 6000));

    console.log("Scrolling down 2500px...");
    await page.evaluate(() => window.scrollTo(0, 2500));
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Scrolling back to top...");
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(resolve => setTimeout(resolve, 3000));

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
})();
