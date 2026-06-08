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

  const requests = [];
  page.on('request', req => {
    if (req.url().includes('core-renderer.js') || req.url().includes('hero-project.js')) {
      requests.push({ type: 'request', url: req.url(), method: req.method() });
    }
  });

  page.on('response', res => {
    if (res.url().includes('core-renderer.js') || res.url().includes('hero-project.js')) {
      requests.push({
        type: 'response',
        url: res.url(),
        status: res.status(),
        ok: res.ok(),
        headers: res.headers()
      });
    }
  });

  page.on('requestfailed', req => {
    if (req.url().includes('core-renderer.js') || req.url().includes('hero-project.js')) {
      requests.push({ type: 'failed', url: req.url(), errorText: req.failure().errorText });
    }
  });

  try {
    console.log("Navigating...");
    await page.goto('https://hafiz-sk-portfolio-v2.vercel.app', { waitUntil: 'load', timeout: 20000 });
    console.log("Loaded. Waiting 5 seconds...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log("\n--- REQUESTS TRACE ---");
    console.log(JSON.stringify(requests, null, 2));

  } catch (err) {
    console.error("Failed:", err.message);
  } finally {
    await browser.close();
  }
})();
