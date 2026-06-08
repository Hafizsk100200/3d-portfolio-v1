module.paths.push('c:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\node_modules');

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

  console.log("Navigating to http://localhost:5174/2 ...");
  try {
    await page.goto('http://localhost:5174/2', { waitUntil: 'networkidle2', timeout: 15000 });
    console.log("Page loaded. Waiting for preloader (6s)...");
    await new Promise(resolve => setTimeout(resolve, 6000));

    console.log("Scrolling to 10000px...");
    await page.evaluate(() => window.scrollTo(0, 10000));
    await new Promise(resolve => setTimeout(resolve, 2000));

    const rects = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('.cg-img'));
      return imgs.map(img => {
        const rect = img.getBoundingClientRect();
        const slices = Array.from(img.querySelectorAll('.cg-slice')).map(s => {
          const sRect = s.getBoundingClientRect();
          return {
            width: sRect.width,
            height: sRect.height,
            left: sRect.left,
            top: sRect.top,
            style: s.style.cssText,
            bgImage: window.getComputedStyle(s).backgroundImage,
          };
        });

        return {
          title: img.getAttribute('title') || 'none',
          opacity: window.getComputedStyle(img).opacity,
          zIndex: window.getComputedStyle(img).zIndex,
          transform: window.getComputedStyle(img).transform,
          width: rect.width,
          height: rect.height,
          left: rect.left,
          top: rect.top,
          slices: slices,
        };
      });
    });

    console.log("Image Rects and Slice details:", JSON.stringify(rects, null, 2));

  } catch (err) {
    console.error("Rect check failed:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
})();
