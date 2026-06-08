const puppeteer = require('puppeteer-core');
const path = require('path');

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

  page.on('console', msg => {
    console.log(`[BROWSER] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  const getElementInfo = async (label) => {
    return page.evaluate((lbl) => {
      const getStyles = (el) => {
        if (!el) return null;
        const s = window.getComputedStyle(el);
        return {
          id: el.id,
          class: el.className,
          zIndex: s.zIndex,
          opacity: s.opacity,
          display: s.display,
          visibility: s.visibility,
          transform: s.transform,
          position: s.position,
          inset: `${s.top} ${s.right} ${s.bottom} ${s.left}`,
          width: s.width,
          height: s.height
        };
      };
      
      const hero = document.getElementById('hero');
      const heroCanvas = document.getElementById('hero-canvas');
      const revealWrap = document.getElementById('reveal-image-wrap');
      const revealCanvas = document.getElementById('reveal-canvas');
      const body = document.body;
      
      return {
        state: lbl,
        scrollY: window.scrollY,
        bodyBg: window.getComputedStyle(body).backgroundColor,
        hero: getStyles(hero),
        heroCanvas: getStyles(heroCanvas),
        revealWrap: getStyles(revealWrap),
        revealCanvas: getStyles(revealCanvas)
      };
    }, label);
  };

  console.log("Navigating to http://localhost:5176/ ...");
  try {
    await page.goto('http://localhost:5176/', { waitUntil: 'load', timeout: 15000 });
    console.log("Page loaded. Waiting 6 seconds for preloader...");
    await new Promise(resolve => setTimeout(resolve, 6000));

    console.log("\n=== STATE: INITIAL ===");
    console.log(JSON.stringify(await getElementInfo('INITIAL'), null, 2));

    console.log("\nScrolling down to 2500px...");
    await page.evaluate(() => {
      window.scrollTo(0, 2500);
    });
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log("\n=== STATE: SCROLL_DOWN ===");
    console.log(JSON.stringify(await getElementInfo('SCROLL_DOWN'), null, 2));

    console.log("\nScrolling back to 0...");
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log("\n=== STATE: SCROLL_BACK_TOP ===");
    console.log(JSON.stringify(await getElementInfo('SCROLL_BACK_TOP'), null, 2));

  } catch (err) {
    console.error("Diagnostic execution failed:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
})();
