const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Hafiz SK\\.gemini\\antigravity-ide\\brain\\0f51a07a-ab3f-4ab3-b83f-ad4a2f17dfdf\\scratch';

(async () => {
  console.log("Launching browser to inspect original site...");
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  page.on('console', msg => {
    console.log(`[BROWSER] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  console.log("Navigating to https://lukebaffait.fr/ ...");
  try {
    await page.goto('https://lukebaffait.fr/', { waitUntil: 'networkidle2', timeout: 30000 });
    console.log("Page loaded. Waiting for preloader to finish (6 seconds)...");
    await new Promise(resolve => setTimeout(resolve, 6000));

    // Get diagnostics at top
    let diag = await page.evaluate(() => {
      const hero = document.getElementById('hero');
      const canvasContainer = document.getElementById('hero-canvas');
      const innerCanvas = canvasContainer ? canvasContainer.querySelector('canvas') : null;
      
      return {
        bodyBg: window.getComputedStyle(document.body).backgroundColor,
        heroBg: hero ? window.getComputedStyle(hero).backgroundColor : 'null',
        heroOpacity: hero ? window.getComputedStyle(hero).opacity : 'null',
        heroZIndex: hero ? window.getComputedStyle(hero).zIndex : 'null',
        containerDisplay: canvasContainer ? window.getComputedStyle(canvasContainer).display : 'null',
        containerOpacity: canvasContainer ? window.getComputedStyle(canvasContainer).opacity : 'null',
        containerZIndex: canvasContainer ? window.getComputedStyle(canvasContainer).zIndex : 'null',
        innerCanvasExists: !!innerCanvas,
        innerCanvasStyle: innerCanvas ? innerCanvas.style.cssText : '',
        innerCanvasClass: innerCanvas ? innerCanvas.className : '',
      };
    });
    console.log("Original site initial diagnostics:", diag);

    // Scroll down 2000px
    console.log("Scrolling down 2000px...");
    await page.evaluate(() => {
      window.scrollTo(0, 2000);
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get diagnostics at 2000px
    diag = await page.evaluate(() => {
      const hero = document.getElementById('hero');
      const canvasContainer = document.getElementById('hero-canvas');
      const innerCanvas = canvasContainer ? canvasContainer.querySelector('canvas') : null;
      
      return {
        heroOpacity: hero ? window.getComputedStyle(hero).opacity : 'null',
        containerOpacity: canvasContainer ? window.getComputedStyle(canvasContainer).opacity : 'null',
        innerCanvasStyle: innerCanvas ? innerCanvas.style.cssText : '',
      };
    });
    console.log("Original site diagnostics scrolled down:", diag);

    // Scroll back to top
    console.log("Scrolling back to top...");
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get diagnostics back at top
    diag = await page.evaluate(() => {
      const hero = document.getElementById('hero');
      const canvasContainer = document.getElementById('hero-canvas');
      const innerCanvas = canvasContainer ? canvasContainer.querySelector('canvas') : null;
      
      return {
        heroOpacity: hero ? window.getComputedStyle(hero).opacity : 'null',
        containerOpacity: canvasContainer ? window.getComputedStyle(canvasContainer).opacity : 'null',
        innerCanvasStyle: innerCanvas ? innerCanvas.style.cssText : '',
      };
    });
    console.log("Original site diagnostics scrolled back to top:", diag);

  } catch (err) {
    console.error("Failed:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
})();
