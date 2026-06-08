const puppeteer = require('puppeteer-core');
const path = require('path');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Hafiz SK\\.gemini\\antigravity-ide\\brain\\0f51a07a-ab3f-4ab3-b83f-ad4a2f17dfdf';

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  console.log("Navigating to http://localhost:5176/ ...");
  await page.goto('http://localhost:5176/', { waitUntil: 'load' });
  
  console.log("Waiting for preloader (6 seconds)...");
  await new Promise(resolve => setTimeout(resolve, 6000));

  // Change style of .v2-body-wrap before scrolling
  await page.evaluate(() => {
    const el = document.querySelector('.v2-body-wrap');
    if (el) {
      el.style.overflowX = 'visible';
      console.log("Successfully changed .v2-body-wrap overflow-x to visible");
    } else {
      console.error(".v2-body-wrap not found!");
    }
  });

  // Scroll to 1200px
  console.log("Scrolling to 1200px...");
  await page.evaluate(() => {
    window.scrollTo(0, 1200);
  });
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Capture screenshot
  await page.screenshot({ path: path.join(artifactDir, 'scroll_1200px_fixed.png') });
  console.log("Saved scroll_1200px_fixed.png");

  // Get diagnostics
  const diagnostics = await page.evaluate(() => {
    const hero = document.getElementById('hero');
    const heroCanvas = document.getElementById('hero-canvas');
    const wrap = document.getElementById('reveal-image-wrap');
    const canvas = document.getElementById('reveal-canvas');
    
    const getRect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, left: r.left, width: r.width, height: r.height };
    };

    return {
      heroStyle: hero ? {
        position: window.getComputedStyle(hero).position,
        top: window.getComputedStyle(hero).top,
        opacity: window.getComputedStyle(hero).opacity,
        rect: getRect(hero)
      } : null,
      heroCanvasStyle: heroCanvas ? {
        zIndex: window.getComputedStyle(heroCanvas).zIndex,
        opacity: window.getComputedStyle(heroCanvas).opacity,
        rect: getRect(heroCanvas)
      } : null,
      wrapRect: getRect(wrap),
      canvasRect: getRect(canvas)
    };
  });

  console.log("Diagnostics after fix:", JSON.stringify(diagnostics, null, 2));

  await browser.close();
})();
