module.paths.push('c:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\node_modules');

const puppeteer = require('puppeteer-core');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log("Navigating to http://localhost:5174/2 ...");
  try {
    await page.goto('http://localhost:5174/2', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 6000));

    await page.evaluate(() => window.scrollTo(0, 10000));
    await new Promise(resolve => setTimeout(resolve, 1000));

    const styles = await page.evaluate(() => {
      const pin = document.getElementById('circle-gallery-pin');
      const spacer = pin ? pin.parentElement : null;
      return {
        pinInline: pin ? pin.style.cssText : 'none',
        spacerInline: spacer ? spacer.style.cssText : 'none',
      };
    });

    console.log("At scrollY=10000:");
    console.log("- Pinned element inline style:", styles.pinInline);
    console.log("- Spacer element inline style:", styles.spacerInline);

  } catch (err) {
    console.error("Style check failed:", err);
  } finally {
    await browser.close();
  }
})();
