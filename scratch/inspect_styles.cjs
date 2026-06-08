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

  try {
    console.log("Navigating to https://hafiz-sk-portfolio-v2.vercel.app ...");
    await page.goto('https://hafiz-sk-portfolio-v2.vercel.app', { waitUntil: 'load', timeout: 20000 });
    console.log("Page loaded. Waiting 5 seconds...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    const elementStyles = await page.evaluate(() => {
      const getStyles = (selector) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const style = window.getComputedStyle(el);
        return {
          exists: true,
          display: style.display,
          opacity: style.opacity,
          visibility: style.visibility,
          zIndex: style.zIndex,
          backgroundColor: style.backgroundColor,
          color: style.color,
          transform: style.transform,
          width: style.width,
          height: style.height,
          position: style.position,
          inset: style.inset || `${style.top} ${style.right} ${style.bottom} ${style.left}`
        };
      };

      return {
        body: getStyles('body'),
        root: getStyles('#root'),
        introBg: getStyles('#intro-bg'),
        nameLayer: getStyles('#name-layer'),
        preloaderContent: getStyles('#preloader-content'),
        transitionPanel: getStyles('#transition-panel'),
        tPanelDark: getStyles('#t-panel-dark'),
        tPanelRed: getStyles('#t-panel-red'),
        scrollWrap: getStyles('#scroll-wrap'),
        hero: getStyles('#hero')
      };
    });

    console.log("\n--- COMPUTED STYLES ON LIVE SITE ---");
    console.log(JSON.stringify(elementStyles, null, 2));

  } catch (err) {
    console.error("Failed:", err.message);
  } finally {
    await browser.close();
  }
})();
