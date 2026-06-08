module.paths.push('C:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\node_modules');

const puppeteer = require('puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  page.on('console', msg => console.log(`[PAGE CONSOLE] ${msg.text()}`));
  page.on('pageerror', err => console.error(`[PAGE ERROR] ${err.message}`));

  try {
    console.log("Navigating to https://hafiz-sk-portfolio-v2.vercel.app ...");
    await page.goto('https://hafiz-sk-portfolio-v2.vercel.app', { waitUntil: 'load', timeout: 20000 });
    console.log("Page loaded. Injecting script test...");

    const result = await page.evaluate(async () => {
      console.log("Starting test inside browser...");
      
      const loadScript = (src, useDefer, useAsyncFalse) => {
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = src + '?t=' + Date.now(); // bypass cache
          if (useDefer) script.defer = true;
          if (useAsyncFalse) script.async = false;
          
          let resolved = false;
          script.onload = () => {
            console.log(`onload fired for ${src}`);
            resolved = true;
            resolve({ status: 'onload', coreRendererDefined: typeof window.CoreRenderer !== 'undefined' });
          };
          script.onerror = () => {
            console.log(`onerror fired for ${src}`);
            resolved = true;
            resolve({ status: 'onerror' });
          };
          
          document.body.appendChild(script);
          
          setTimeout(() => {
            if (!resolved) {
              console.log(`timeout (3s) for ${src}`);
              resolve({ status: 'timeout' });
            }
          }, 3000);
        });
      };

      console.log("Testing with defer=true...");
      const resDefer = await loadScript('/v2/js/core-renderer.js', true, false);

      console.log("Testing with async=false...");
      const resAsyncFalse = await loadScript('/v2/js/core-renderer.js', false, true);

      return {
        resDefer,
        resAsyncFalse
      };
    });

    console.log("\n--- DYNAMIC SCRIPT INJECTION RESULT ---");
    console.log(JSON.stringify(result, null, 2));

  } catch (err) {
    console.error("Failed:", err.message);
  } finally {
    await browser.close();
  }
})();
