module.paths.push('C:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\node_modules');

const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Hafiz SK\\.gemini\\antigravity-ide\\brain\\0f51a07a-ab3f-4ab3-b83f-ad4a2f17dfdf';

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  const consoleLogs = [];
  const errors = [];

  page.on('console', msg => {
    consoleLogs.push(`[CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    errors.push(`[PAGE ERROR] ${err.message}`);
  });

  try {
    console.log("Navigating to http://localhost:5176/ ...");
    await page.goto('http://localhost:5176/', { waitUntil: 'load', timeout: 15000 });
    console.log("Page loaded. Waiting 5 seconds for transitions/loading to complete...");
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log(`Title: "${await page.evaluate(() => document.title)}"`);
    console.log(`\nConsole logs:`);
    consoleLogs.forEach(log => console.log(log));
    
    if (errors.length > 0) {
      console.log(`\nErrors encountered:`);
      errors.forEach(err => console.error(err));
    } else {
      console.log(`\nNo page errors encountered!`);
    }

    const outputPath = path.join(artifactDir, 'v2_local_dev.png');
    await page.screenshot({ path: outputPath });
    console.log(`Saved local dev screenshot to ${outputPath}`);
  } catch (err) {
    console.error("Test execution failed:", err.message);
  } finally {
    await browser.close();
  }
})();
