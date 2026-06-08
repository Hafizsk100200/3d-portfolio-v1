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

  const pageErrors = [];
  page.on('pageerror', err => {
    pageErrors.push(`[PAGE ERROR] ${err.message}`);
  });

  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  // Listen for unhandled promise rejections inside the browser page context
  await page.exposeFunction('onUnhandledRejection', (message) => {
    pageErrors.push(`[UNHANDLED REJECTION] ${message}`);
  });

  await page.evaluateOnNewDocument(() => {
    window.addEventListener('unhandledrejection', event => {
      window.onUnhandledRejection(event.reason ? (event.reason.message || event.reason.toString()) : 'Unknown rejection');
    });
  });

  try {
    console.log("Navigating to https://hafiz-sk-portfolio-v2.vercel.app ...");
    const response = await page.goto('https://hafiz-sk-portfolio-v2.vercel.app', { waitUntil: 'load', timeout: 20000 });
    console.log("Response status:", response.status());
    
    console.log("Waiting 5 seconds for page execution...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log("\n--- PAGE ERRORS & REJECTIONS ---");
    if (pageErrors.length === 0) console.log("None");
    pageErrors.forEach(err => console.log(err));

    console.log("\n--- CONSOLE LOGS ---");
    if (consoleLogs.length === 0) console.log("None");
    consoleLogs.forEach(log => console.log(log));

  } catch (err) {
    console.error("Failed:", err.message);
  } finally {
    await browser.close();
  }
})();
