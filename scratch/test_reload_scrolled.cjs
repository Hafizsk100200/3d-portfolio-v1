const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Hafiz SK\\.gemini\\antigravity-ide\\brain\\0f51a07a-ab3f-4ab3-b83f-ad4a2f17dfdf';

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
  await page.setViewport({ width: 1280, height: 720 });

  page.on('console', msg => {
    console.log(`[BROWSER] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  try {
    console.log("1. Initial navigation to http://localhost:5176/ ...");
    await page.goto('http://localhost:5176/', { waitUntil: 'load', timeout: 15000 });
    console.log("Waiting for preloader...");
    await new Promise(resolve => setTimeout(resolve, 6000));

    console.log("2. Scrolling down 2000px...");
    await page.evaluate(() => {
      window.scrollTo(0, 2000);
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("3. Reloading page...");
    await page.reload({ waitUntil: 'load', timeout: 15000 });
    console.log("Waiting for reload preloader (6 seconds)...");
    await new Promise(resolve => setTimeout(resolve, 6000));

    // Take screenshot after reload
    await page.screenshot({ path: path.join(artifactDir, 'reload_scrolled_hero.png') });
    console.log("Saved reload_scrolled_hero.png");

    const diagnostics = await page.evaluate(() => {
      const hero = document.getElementById('hero');
      const canvasContainer = document.getElementById('hero-canvas');
      const innerCanvas = canvasContainer ? canvasContainer.querySelector('canvas') : null;
      
      return {
        scrollY: window.scrollY,
        heroOpacity: hero ? window.getComputedStyle(hero).opacity : 'null',
        containerOpacity: canvasContainer ? window.getComputedStyle(canvasContainer).opacity : 'null',
        innerCanvasExists: !!innerCanvas,
        innerCanvasStyle: innerCanvas ? innerCanvas.style.cssText : '',
      };
    });
    console.log("Diagnostics after reload:", diagnostics);

  } catch (err) {
    console.error("Test execution failed:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
})();
