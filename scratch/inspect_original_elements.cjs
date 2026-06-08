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

  console.log("Inspecting original site background images and styling...");
  try {
    await page.goto('https://lukebaffait.fr/', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 5000));

    const styles = await page.evaluate(() => {
      const hero = document.getElementById('hero');
      const canvasContainer = document.getElementById('hero-canvas');
      const innerCanvas = canvasContainer ? canvasContainer.querySelector('canvas') : null;
      const body = document.body;

      const getBg = (el) => {
        if (!el) return null;
        const style = window.getComputedStyle(el);
        return {
          backgroundImage: style.backgroundImage,
          backgroundColor: style.backgroundColor,
          backgroundSize: style.backgroundSize,
          backgroundPosition: style.backgroundPosition,
          backgroundRepeat: style.backgroundRepeat,
          opacity: style.opacity,
          visibility: style.visibility,
          zIndex: style.zIndex,
          position: style.position
        };
      };

      return {
        body: getBg(body),
        hero: getBg(hero),
        canvasContainer: getBg(canvasContainer),
        innerCanvas: innerCanvas ? {
          style: innerCanvas.style.cssText,
          width: innerCanvas.width,
          height: innerCanvas.height
        } : null,
        html: document.documentElement.outerHTML.substring(0, 1000)
      };
    });

    console.log("STYLING DIAGNOSTICS:");
    console.log(JSON.stringify(styles, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
