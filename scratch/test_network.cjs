module.paths.push('c:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\node_modules');

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
  
  // Track all network requests
  const requests = [];
  page.on('response', response => {
    requests.push({
      url: response.url(),
      status: response.status(),
      statusText: response.statusText(),
    });
  });

  page.on('requestfailed', request => {
    console.log(`[REQUEST FAILED] ${request.url()}: ${request.failure().errorText}`);
  });

  console.log("Navigating to http://localhost:5174/2 ...");
  try {
    await page.goto('http://localhost:5174/2', { waitUntil: 'networkidle2', timeout: 15000 });
    console.log("Page loaded. Checking network status...");
    
    // Sort and group by status
    const successful = requests.filter(r => r.status >= 200 && r.status < 300);
    const redirected = requests.filter(r => r.status >= 300 && r.status < 400);
    const failed = requests.filter(r => r.status >= 400);

    console.log(`Successful requests: ${successful.length}`);
    console.log(`Redirected requests: ${redirected.length}`);
    console.log(`Failed requests: ${failed.length}`);

    if (failed.length > 0) {
      console.log("\n--- FAILED REQUESTS ---");
      failed.forEach(r => {
        console.log(`- ${r.status} ${r.statusText}: ${r.url}`);
      });
      console.log("-----------------------\n");
    }

  } catch (err) {
    console.error("Network check failed:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
})();
