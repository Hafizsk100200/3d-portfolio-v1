const puppeteer = require('puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  console.log("Navigating to https://lukebaffait.fr/js/hero-project.js ...");
  try {
    await page.goto('https://lukebaffait.fr/js/hero-project.js', { waitUntil: 'networkidle2' });
    const content = await page.evaluate(() => document.body.innerText);
    
    // Find any image files in the content
    const regex = /["'][^"']*\.(png|jpg|jpeg|webp|gif|avif)[^"']*["']/gi;
    let match;
    console.log("=== Original hero-project.js image references ===");
    while ((match = regex.exec(content)) !== null) {
      console.log(match[0]);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
