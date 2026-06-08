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

  try {
    console.log("Navigating to https://hafiz-sk-portfolio-v2.vercel.app ...");
    await page.goto('https://hafiz-sk-portfolio-v2.vercel.app', { waitUntil: 'load', timeout: 20000 });
    console.log("Page loaded. Waiting 5 seconds...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    const check = await page.evaluate(() => {
      return {
        windowExports: typeof window.exports,
        windowModule: typeof window.module,
        windowDefine: typeof window.define,
        globalExports: typeof exports,
        globalModule: typeof module,
        globalDefine: typeof define
      };
    });

    console.log("\n--- GLOBALS CHECK DETAILS ---");
    console.log(JSON.stringify(check, null, 2));

  } catch (err) {
    console.error("Failed:", err.message);
  } finally {
    await browser.close();
  }
})();
