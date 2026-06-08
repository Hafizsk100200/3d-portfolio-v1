const puppeteer = require('puppeteer-core');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log("Launching browser to inspect window.CoreRenderer...");
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5176/', { waitUntil: 'load', timeout: 15000 });
    console.log("Page loaded. Waiting for preloader...");
    await new Promise(resolve => setTimeout(resolve, 6000));

    const coreRendererDetails = await page.evaluate(() => {
      if (!window.CoreRenderer) return 'window.CoreRenderer is not defined';
      
      const keys = Object.keys(window.CoreRenderer);
      const methods = [];
      for (const key in window.CoreRenderer) {
        if (typeof window.CoreRenderer[key] === 'function') {
          methods.push(key);
        }
      }

      return {
        keys,
        methods,
        initStr: window.CoreRenderer.init ? window.CoreRenderer.init.toString() : 'null',
        destroyStr: window.CoreRenderer.destroy ? window.CoreRenderer.destroy.toString() : 'null',
      };
    });

    console.log("CoreRenderer details in browser:", coreRendererDetails);

  } catch (err) {
    console.error("Failed to inspect:", err.message);
  } finally {
    await browser.close();
  }
})();
