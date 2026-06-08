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

    const canvasInfo = await page.evaluate(() => {
      const canvases = Array.from(document.querySelectorAll('canvas'));
      return canvases.map(c => {
        return {
          id: c.id,
          className: c.className,
          style: c.style.cssText,
          width: c.width,
          height: c.height,
          parent: c.parentElement ? {
            id: c.parentElement.id,
            className: c.parentElement.className,
            style: window.getComputedStyle(c.parentElement).cssText.substring(0, 300)
          } : null,
          computedStyle: {
            position: window.getComputedStyle(c).position,
            zIndex: window.getComputedStyle(c).zIndex,
            opacity: window.getComputedStyle(c).opacity,
            display: window.getComputedStyle(c).display,
            width: window.getComputedStyle(c).width,
            height: window.getComputedStyle(c).height
          }
        };
      });
    });

    console.log("=== CANVAS INFO ON OUR SITE ===");
    console.log(JSON.stringify(canvasInfo, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
