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

  console.log("Navigating to http://localhost:5176/ ...");
  try {
    await page.goto('http://localhost:5176/', { waitUntil: 'load', timeout: 15000 });
    console.log("Page loaded. Waiting for preloader (6 seconds)...");
    await new Promise(resolve => setTimeout(resolve, 6000));

    // Scroll 1: Down to 1200px
    console.log("Scroll 1: Scrolling down to 1200px...");
    await page.evaluate(() => {
      window.scrollTo(0, 1200);
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({ path: path.join(artifactDir, 'scroll_1_down.png') });
    console.log("Saved scroll_1_down.png");

    // Scroll 2: Back to 0
    console.log("Scroll 2: Scrolling back to 0...");
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({ path: path.join(artifactDir, 'scroll_2_top.png') });
    console.log("Saved scroll_2_top.png");

    // Scroll 3: Down to 1200px again
    console.log("Scroll 3: Scrolling down to 1200px again...");
    await page.evaluate(() => {
      window.scrollTo(0, 1200);
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({ path: path.join(artifactDir, 'scroll_3_down.png') });
    console.log("Saved scroll_3_down.png");

    // Check canvas element states at the end
    const diagnostics = await page.evaluate(() => {
      const hero = document.getElementById('hero');
      const canvasContainer = document.getElementById('hero-canvas');
      const innerCanvas = canvasContainer ? canvasContainer.querySelector('canvas') : null;
      const revealCanvas = document.getElementById('reveal-canvas');
      const revealWrap = document.getElementById('reveal-image-wrap');
      
      return {
        heroOpacity: hero ? window.getComputedStyle(hero).opacity : 'null',
        containerOpacity: canvasContainer ? window.getComputedStyle(canvasContainer).opacity : 'null',
        innerCanvasExists: !!innerCanvas,
        revealCanvasStyle: revealCanvas ? revealCanvas.style.cssText : '',
        revealWrapOpacity: revealWrap ? window.getComputedStyle(revealWrap).opacity : 'null',
        revealWrapTransform: revealWrap ? window.getComputedStyle(revealWrap).transform : 'null',
      };
    });
    console.log("Diagnostics:", diagnostics);

  } catch (err) {
    console.error("Test execution failed:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
})();
