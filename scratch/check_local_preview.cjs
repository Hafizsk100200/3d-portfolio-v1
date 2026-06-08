module.paths.push('C:\\Users\\Hafiz SK\\OneDrive\Documents\\3D Protfolio\\node_modules');

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
  
  const consoleLogs = [];
  const errors = [];

  page.on('console', msg => {
    consoleLogs.push(`[CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    errors.push(`[PAGE ERROR] ${err.message}`);
  });

  try {
    console.log("Navigating to http://localhost:4173/ ...");
    await page.goto('http://localhost:4173/', { waitUntil: 'load', timeout: 15000 });
    console.log("Page loaded. Waiting 4 seconds for scripts to execute...");
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    console.log(`Title: "${await page.evaluate(() => document.title)}"`);
    console.log(`Console logs:`);
    consoleLogs.forEach(log => console.log(log));
    
    if (errors.length > 0) {
      console.log(`\nErrors encountered:`);
      errors.forEach(err => console.error(err));
    } else {
      console.log(`\nNo page errors encountered!`);
    }
  } catch (err) {
    console.error("Test execution failed:", err.message);
  } finally {
    await browser.close();
  }
})();
