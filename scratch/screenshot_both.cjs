module.paths.push('C:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\node_modules');

const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:/Users/Hafiz SK/.gemini/antigravity-ide/brain/0f51a07a-ab3f-4ab3-b83f-ad4a2f17dfdf';

async function takeScreenshot(url, filename, waitMs = 8000) {
  console.log(`Taking screenshot of ${url}...`);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 20000 });
    await new Promise(resolve => setTimeout(resolve, waitMs));
    
    const outputPath = path.join(artifactDir, filename);
    await page.screenshot({ path: outputPath });
    console.log(`Saved screenshot to ${outputPath}`);
  } catch (err) {
    console.error(`Failed: ${err.message}`);
  } finally {
    await browser.close();
  }
}

(async () => {
  await takeScreenshot('https://hafiz-sk-portfolio.vercel.app', 'v1_current.png');
  await takeScreenshot('https://hafiz-sk-portfolio-v2.vercel.app', 'v2_current.png');
  console.log('Done!');
})();
