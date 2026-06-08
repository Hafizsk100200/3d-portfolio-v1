module.paths.push('c:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\node_modules');

const puppeteer = require('puppeteer-core');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log("Navigating to http://localhost:5174/2 ...");
  try {
    await page.goto('http://localhost:5174/2', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 6000));

    await page.evaluate(() => window.scrollTo(0, 10000));
    await new Promise(resolve => setTimeout(resolve, 1000));

    const ancestors = await page.evaluate(() => {
      const pin = document.getElementById('circle-gallery-pin');
      const results = [];
      let el = pin;
      while (el) {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        results.push({
          tagName: el.tagName.toLowerCase(),
          id: el.id,
          className: el.className,
          position: style.position,
          transform: style.transform,
          willChange: style.willChange,
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
        el = el.parentElement;
      }
      return results;
    });

    console.log("Ancestors details:");
    console.log(JSON.stringify(ancestors, null, 2));

  } catch (err) {
    console.error("Ancestor check failed:", err);
  } finally {
    await browser.close();
  }
})();
