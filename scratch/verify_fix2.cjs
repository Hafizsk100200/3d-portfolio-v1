const puppeteer = require('puppeteer-core');
const path = require('path');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Hafiz SK\\.gemini\\antigravity-ide\\brain\\0f51a07a-ab3f-4ab3-b83f-ad4a2f17dfdf';

(async () => {
  console.log("Launching browser (no cache)...");
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-cache', '--incognito']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  // Disable cache
  await page.setCacheEnabled(false);

  page.on('pageerror', err => {
    console.error(`[PAGE ERROR] ${err.message}`);
  });

  console.log("Navigating to http://localhost:5176/ ...");
  await page.goto('http://localhost:5176/', { waitUntil: 'networkidle2', timeout: 20000 });
  
  console.log("Waiting for preloader (7 seconds)...");
  await new Promise(resolve => setTimeout(resolve, 7000));

  // Check hero-canvas position BEFORE scrolling
  let diag = await page.evaluate(() => {
    const hc = document.getElementById('hero-canvas');
    const innerCanvas = hc ? hc.querySelector('canvas') : null;
    const s = hc ? window.getComputedStyle(hc) : null;
    return {
      heroCanvasExists: !!hc,
      position: s ? s.position : 'N/A',
      zIndex: s ? s.zIndex : 'N/A',
      top: s ? s.top : 'N/A',
      left: s ? s.left : 'N/A',
      width: s ? s.width : 'N/A',
      height: s ? s.height : 'N/A',
      rect: hc ? (() => { const r = hc.getBoundingClientRect(); return { top: r.top, left: r.left, width: r.width, height: r.height }; })() : null,
      innerCanvasExists: !!innerCanvas,
      parentId: hc ? hc.parentElement?.id : 'N/A',
      parentClass: hc ? hc.parentElement?.className : 'N/A',
    };
  });
  console.log("Initial hero-canvas diagnostics:", JSON.stringify(diag, null, 2));

  await page.screenshot({ path: path.join(artifactDir, 'fix2_initial.png') });

  // Scroll to 1200px
  console.log("Scrolling to 1200px...");
  await page.evaluate(() => { window.scrollTo(0, 1200); });
  await new Promise(resolve => setTimeout(resolve, 2000));

  diag = await page.evaluate(() => {
    const hc = document.getElementById('hero-canvas');
    const s = hc ? window.getComputedStyle(hc) : null;
    return {
      position: s ? s.position : 'N/A',
      rect: hc ? (() => { const r = hc.getBoundingClientRect(); return { top: r.top, left: r.left, width: r.width, height: r.height }; })() : null,
    };
  });
  console.log("hero-canvas at scroll 1200:", JSON.stringify(diag, null, 2));
  await page.screenshot({ path: path.join(artifactDir, 'fix2_scroll_1200.png') });

  // Scroll back to top
  console.log("Scrolling back to top...");
  await page.evaluate(() => { window.scrollTo(0, 0); });
  await new Promise(resolve => setTimeout(resolve, 2000));
  await page.screenshot({ path: path.join(artifactDir, 'fix2_scroll_back.png') });

  await browser.close();
  console.log("Done.");
})();
