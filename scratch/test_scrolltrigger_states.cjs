const puppeteer = require('puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  console.log("Navigating to http://localhost:5176/ ...");
  try {
    await page.goto('http://localhost:5176/', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 6000));

    const check = async (label) => {
      const state = await page.evaluate(() => {
        const wrap = document.getElementById('reveal-image-wrap');
        const canvas = document.getElementById('reveal-canvas');
        return {
          scrollY: window.scrollY,
          wrapOpacity: wrap ? window.getComputedStyle(wrap).opacity : 'null',
          wrapDisplay: wrap ? window.getComputedStyle(wrap).display : 'null',
          canvasStyle: canvas ? canvas.style.cssText : 'null',
          canvasTransform: canvas ? window.getComputedStyle(canvas).transform : 'null'
        };
      });
      console.log(`[${label}]`, state);
    };

    await check('Initially at top');

    console.log("Scrolling down to 1500px...");
    await page.evaluate(() => window.scrollTo(0, 1500));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await check('Scrolled to 1500px');

    console.log("Scrolling back to 0...");
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await check('Scrolled back to 0');

  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
