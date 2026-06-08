module.paths.push('c:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\node_modules');

const puppeteer = require('puppeteer-core');
const path = require('path');

// Locate local Chrome installation on Windows
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
    console.log("Page loaded. Waiting for preloader to finish (6 seconds)...");
    await new Promise(resolve => setTimeout(resolve, 6000));

    // Take screenshot of hero initially
    const screenshotDir = 'C:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\scratch';
    await page.screenshot({ path: path.join(screenshotDir, 'hero_initial.png') });
    console.log("Saved hero_initial.png");

    // Scroll down to 2000px
    console.log("Scrolling down 2000px...");
    await page.evaluate(() => {
      window.scrollTo(0, 2000);
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Scroll back to top
    console.log("Scrolling back to top...");
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Take screenshot of hero after scroll back
    await page.screenshot({ path: path.join(screenshotDir, 'hero_after_scroll.png') });
    console.log("Saved hero_after_scroll.png");

    // Inspect elements
    const diagnostics = await page.evaluate(() => {
      const hero = document.getElementById('hero');
      const canvasContainer = document.getElementById('hero-canvas');
      const innerCanvas = canvasContainer ? canvasContainer.querySelector('canvas') : null;
      
      return {
        heroOpacity: hero ? window.getComputedStyle(hero).opacity : 'null',
        heroDisplay: hero ? window.getComputedStyle(hero).display : 'null',
        containerDisplay: canvasContainer ? window.getComputedStyle(canvasContainer).display : 'null',
        containerOpacity: canvasContainer ? window.getComputedStyle(canvasContainer).opacity : 'null',
        innerCanvasExists: !!innerCanvas,
        innerCanvasWidth: innerCanvas ? innerCanvas.width : 0,
        innerCanvasHeight: innerCanvas ? innerCanvas.height : 0,
        innerCanvasStyle: innerCanvas ? innerCanvas.style.cssText : '',
      };
    });

    console.log("Diagnostics after scroll-back:", diagnostics);

  } catch (err) {
    console.error("Test execution failed:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
})();
