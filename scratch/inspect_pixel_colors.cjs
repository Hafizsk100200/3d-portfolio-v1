const puppeteer = require('puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  console.log("Navigating to http://localhost:5176/ ...");
  try {
    await page.goto('http://localhost:5176/', { waitUntil: 'networkidle2', timeout: 15000 });
    console.log("Page loaded. Waiting 6 seconds...");
    await new Promise(resolve => setTimeout(resolve, 6000));

    // Get pixel color at center of canvas
    const getCanvasPixel = async (stageName) => {
      const color = await page.evaluate(() => {
        const canvas = document.querySelector('#hero-canvas canvas');
        if (!canvas) return 'no canvas';
        const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!ctx) return 'no webgl context';
        
        // Read pixels from WebGL
        const pixels = new Uint8Array(4);
        ctx.readPixels(canvas.width / 2, canvas.height / 2, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, pixels);
        return `rgba(${pixels[0]}, ${pixels[1]}, ${pixels[2]}, ${pixels[3]})`;
      });
      console.log(`[${stageName}] Canvas center pixel:`, color);
    };

    await getCanvasPixel('Initial');

    console.log("Scrolling down 2000px...");
    await page.evaluate(() => window.scrollTo(0, 2000));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await getCanvasPixel('Scrolled Down');

    console.log("Scrolling back to top...");
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await getCanvasPixel('Scrolled Back to Top');

  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
