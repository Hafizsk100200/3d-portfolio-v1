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

  console.log("Loading https://lukebaffait.fr/ ...");
  try {
    await page.goto('https://lukebaffait.fr/', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 5000));

    const canvases = await page.evaluate(() => {
      const elList = document.querySelectorAll('canvas');
      return Array.from(elList).map(el => {
        return {
          id: el.id,
          class: el.className,
          zIndex: window.getComputedStyle(el).zIndex,
          opacity: window.getComputedStyle(el).opacity,
          parent: el.parentElement ? `${el.parentElement.tagName}#${el.parentElement.id}.${el.parentElement.className}` : null,
          style: el.style.cssText
        };
      });
    });

    console.log("CANVASES ON LIVE SITE:", canvases);

  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
