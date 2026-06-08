const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Hafiz SK\\.gemini\\antigravity-ide\\brain\\0f51a07a-ab3f-4ab3-b83f-ad4a2f17dfdf';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  console.log("Navigating to https://lukebaffait.fr/ ...");
  try {
    await page.goto('https://lukebaffait.fr/', { waitUntil: 'networkidle2', timeout: 30000 });
    console.log("Waiting 6 seconds for preloader...");
    await new Promise(resolve => setTimeout(resolve, 6000));

    await page.screenshot({ path: path.join(artifactDir, 'og_scroll_0.png') });
    console.log("Saved og_scroll_0.png");

    console.log("Scrolling to 1200px...");
    await page.evaluate(() => window.scrollTo(0, 1200));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({ path: path.join(artifactDir, 'og_scroll_1200.png') });
    console.log("Saved og_scroll_1200.png");

    console.log("Scrolling to 2500px...");
    await page.evaluate(() => window.scrollTo(0, 2500));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({ path: path.join(artifactDir, 'og_scroll_2500.png') });
    console.log("Saved og_scroll_2500.png");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
})();
