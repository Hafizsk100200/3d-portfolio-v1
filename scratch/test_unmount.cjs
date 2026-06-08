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
    console.log("Mount 1: Navigating to http://localhost:5176/ ...");
    await page.goto('http://localhost:5176/', { waitUntil: 'load', timeout: 15000 });
    console.log("Waiting for preloader (6 seconds)...");
    await new Promise(resolve => setTimeout(resolve, 6000));
    await page.screenshot({ path: path.join(artifactDir, 'mount_1.png') });

    console.log("Navigating to http://localhost:5176/contact (unmounting V2App)...");
    await page.goto('http://localhost:5176/contact', { waitUntil: 'load', timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Mount 2: Navigating back to http://localhost:5176/ ...");
    await page.goto('http://localhost:5176/', { waitUntil: 'load', timeout: 15000 });
    console.log("Waiting for preloader (6 seconds)...");
    await new Promise(resolve => setTimeout(resolve, 6000));
    await page.screenshot({ path: path.join(artifactDir, 'mount_2.png') });

    // Check canvas element states on Mount 2
    const diagnostics = await page.evaluate(() => {
      const hero = document.getElementById('hero');
      const canvasContainer = document.getElementById('hero-canvas');
      const innerCanvas = canvasContainer ? canvasContainer.querySelector('canvas') : null;
      
      return {
        heroOpacity: hero ? window.getComputedStyle(hero).opacity : 'null',
        containerOpacity: canvasContainer ? window.getComputedStyle(canvasContainer).opacity : 'null',
        innerCanvasExists: !!innerCanvas,
        innerCanvasStyle: innerCanvas ? innerCanvas.style.cssText : '',
      };
    });
    console.log("Diagnostics after remount:", diagnostics);

  } catch (err) {
    console.error("Test execution failed:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
})();
