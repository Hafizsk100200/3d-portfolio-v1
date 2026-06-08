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

  const networkResponses = [];
  page.on('response', res => {
    networkResponses.push({
      url: res.url(),
      status: res.status(),
      ok: res.ok()
    });
  });

  const pageErrors = [];
  page.on('pageerror', err => {
    pageErrors.push(err.message);
  });

  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  try {
    console.log("Navigating to https://hafiz-sk-portfolio.vercel.app ...");
    const response = await page.goto('https://hafiz-sk-portfolio.vercel.app', { waitUntil: 'load', timeout: 20000 });
    console.log("Response status:", response.status());
    
    console.log("Waiting 5 seconds for page execution...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log("\n--- PAGE ERRORS ---");
    if (pageErrors.length === 0) console.log("None");
    pageErrors.forEach(err => console.log(err));

    console.log("\n--- CONSOLE LOGS ---");
    if (consoleLogs.length === 0) console.log("None");
    consoleLogs.forEach(log => console.log(log));

    console.log("\n--- FAILED RESPONSES ---");
    const failed = networkResponses.filter(res => !res.ok);
    if (failed.length === 0) console.log("None");
    failed.forEach(res => console.log(`${res.status} - ${res.url}`));

    console.log("\n--- ALL RESPONSES (NON-IMAGE) ---");
    networkResponses.filter(res => !res.url.endsWith('.jpg') && !res.url.endsWith('.png') && !res.url.endsWith('.gif')).forEach(res => {
      console.log(`${res.status} - ${res.url}`);
    });

  } catch (err) {
    console.error("Failed:", err.message);
  } finally {
    await browser.close();
  }
})();
