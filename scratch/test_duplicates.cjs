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

    // Scroll a bit to trigger ScrollTrigger calculations
    await page.evaluate(() => window.scrollTo(0, 5000));
    await new Promise(resolve => setTimeout(resolve, 500));

    const domInfo = await page.evaluate(() => {
      const getSelectorPath = (el) => {
        const path = [];
        while (el && el.nodeType === Node.ELEMENT_NODE) {
          let selector = el.nodeName.toLowerCase();
          if (el.id) {
            selector += '#' + el.id;
          } else if (el.className) {
            selector += '.' + el.className.split(/\s+/).join('.');
          }
          path.unshift(selector);
          el = el.parentNode;
        }
        return path.join(' > ');
      };

      const spacers = Array.from(document.querySelectorAll('.pin-spacer'));
      const spacerPaths = spacers.map(s => getSelectorPath(s));
      
      const pinHtml = document.getElementById('circle-gallery') ? document.getElementById('circle-gallery').innerHTML.substring(0, 1500) : 'none';

      return {
        spacersCount: spacers.length,
        spacerPaths: spacerPaths,
        pinHtmlSample: pinHtml,
      };
    });

    console.log("DOM Diagnostics:");
    console.log(`- Number of pin-spacers: ${domInfo.spacersCount}`);
    console.log("- Spacer paths:\n", domInfo.spacerPaths.join('\n'));
    console.log("- HTML sample inside #circle-gallery:\n", domInfo.pinHtmlSample);

  } catch (err) {
    console.error("Duplicate test failed:", err);
  } finally {
    await browser.close();
  }
})();
