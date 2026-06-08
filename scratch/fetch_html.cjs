const puppeteer = require('puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  console.log("Fetching HTML of original site...");
  try {
    await page.goto('https://lukebaffait.fr/', { waitUntil: 'domcontentloaded' });
    const html = await page.content();
    console.log("=== ORIGINAL SITE HTML ===");
    console.log(html);
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
