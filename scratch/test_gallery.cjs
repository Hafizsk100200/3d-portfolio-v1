module.paths.push('c:\\Users\\Hafiz SK\\OneDrive\Documents\\3D Protfolio\\node_modules');

const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log("Launching browser...");
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  } catch (err) {
    console.error("Failed to launch Chrome:", err.message);
    process.exit(1);
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  page.on('console', msg => {
    console.log(`[BROWSER] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  console.log("Navigating to http://localhost:5174/2 ...");
  try {
    await page.goto('http://localhost:5174/2', { waitUntil: 'networkidle2', timeout: 15000 });
    console.log("Page loaded. Waiting for preloader (6s)...");
    await new Promise(resolve => setTimeout(resolve, 6000));

    const screenshotDir = 'C:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\scratch';

    // Get page height
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log(`Total page height: ${pageHeight}px`);

    // Let's scroll in steps of 1000px and take screenshots
    for (let scrollY = 1000; scrollY < pageHeight; scrollY += 1500) {
      console.log(`Scrolling to ${scrollY}px...`);
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await new Promise(resolve => setTimeout(resolve, 800));

      const stats = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('.cg-img'));
        const phrase = document.getElementById('cg-phrase');
        return {
          scrollY: window.scrollY,
          visibleImgsCount: imgs.filter(img => window.getComputedStyle(img).opacity !== '0').length,
          imgStyles: imgs.map(img => ({
            id: img.getAttribute('title') || 'unknown',
            opacity: window.getComputedStyle(img).opacity,
            transform: window.getComputedStyle(img).transform,
          })),
          phraseOpacity: phrase ? window.getComputedStyle(phrase).opacity : 'none',
          phraseTransform: phrase ? window.getComputedStyle(phrase).transform : 'none',
        };
      });

      console.log(`At scrollY = ${stats.scrollY}: visible images = ${stats.visibleImgsCount}, phrase opacity = ${stats.phraseOpacity}`);
      
      const filename = `scroll_${stats.scrollY}.png`;
      await page.screenshot({ path: path.join(screenshotDir, filename) });
      console.log(`Saved screenshot ${filename}`);
    }

  } catch (err) {
    console.error("Gallery test failed:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
})();
