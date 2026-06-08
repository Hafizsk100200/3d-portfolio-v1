const puppeteer = require('puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  try {
    await page.goto('https://lukebaffait.fr/', { waitUntil: 'domcontentloaded' });
    const head = await page.evaluate(() => document.head.innerHTML);
    console.log("=== ORIGINAL SITE HEAD ===");
    console.log(head);
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
