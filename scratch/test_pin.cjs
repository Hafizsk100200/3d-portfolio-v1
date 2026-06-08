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

    for (let scrollY of [0, 6000, 8000, 10000, 12000]) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await new Promise(resolve => setTimeout(resolve, 500));

      const pinStats = await page.evaluate(() => {
        const sec = document.getElementById('circle-gallery');
        const pin = document.getElementById('circle-gallery-pin');
        const spacer = pin ? pin.parentElement : null;

        const secRect = sec ? sec.getBoundingClientRect() : null;
        const pinRect = pin ? pin.getBoundingClientRect() : null;

        return {
          scrollY: window.scrollY,
          secTop: secRect ? secRect.top : null,
          secBottom: secRect ? secRect.bottom : null,
          pinTop: pinRect ? pinRect.top : null,
          pinBottom: pinRect ? pinRect.bottom : null,
          pinPosition: pin ? window.getComputedStyle(pin).position : null,
          pinTransform: pin ? window.getComputedStyle(pin).transform : null,
          spacerPosition: spacer ? window.getComputedStyle(spacer).position : null,
          spacerTop: spacer ? spacer.getBoundingClientRect().top : null,
        };
      });

      console.log(`scrollY: ${scrollY}`);
      console.log(`- circle-gallery rect: top=${pinStats.secTop}, bottom=${pinStats.secBottom}`);
      console.log(`- circle-gallery-pin rect: top=${pinStats.pinTop}, bottom=${pinStats.pinBottom}`);
      console.log(`- pin styles: position=${pinStats.pinPosition}, transform=${pinStats.pinTransform}`);
      console.log(`- spacer styles: position=${pinStats.spacerPosition}, top=${pinStats.spacerTop}`);
      console.log('----------------------------------------------------');
    }

  } catch (err) {
    console.error("Pin test failed:", err);
  } finally {
    await browser.close();
  }
})();
