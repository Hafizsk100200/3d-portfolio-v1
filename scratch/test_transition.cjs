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
  await page.setViewport({ width: 1400, height: 900 });

  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[BROWSER PAGE ERROR]`, err);
  });

  console.log("Navigating to http://localhost:5173/ ...");
  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    console.log("Waiting 3 seconds for initial animations...");
    await new Promise(r => setTimeout(r, 3000));

    console.log("Scrolling down to footer...");
    await page.evaluate(async () => {
      // Scroll down gradually to trigger scroll animations
      for (let i = 0; i < 40; i++) {
        window.scrollBy(0, 300);
        await new Promise(r => setTimeout(r, 50));
      }
    });

    const scrollYAfterScroll = await page.evaluate(() => window.scrollY);
    console.log(`Current scroll position: ${scrollYAfterScroll}`);

    console.log("Finding footer 'Work' link...");
    const workLink = await page.$('.footer a[href="/works"]');
    if (!workLink) {
      throw new Error("Could not find Work link in footer");
    }

    console.log("Clicking footer 'Work' link...");
    const clickTime = Date.now();
    await workLink.click();

    console.log("Waiting for navigation/URL change...");
    // Let's poll for URL change or wait up to 5 seconds
    let navigated = false;
    for (let i = 0; i < 50; i++) {
      const url = page.url();
      if (url.includes('/works')) {
        navigated = true;
        console.log(`Navigated to: ${url} in ${Date.now() - clickTime}ms`);
        break;
      }
      await new Promise(r => setTimeout(r, 100));
    }

    if (!navigated) {
      console.log(`Did not navigate. Current URL: ${page.url()}`);
    }

    console.log("Waiting 3 seconds for works page animations...");
    await new Promise(r => setTimeout(r, 3000));

    console.log("Finding Back button...");
    const backBtn = await page.$('.back-btn');
    if (!backBtn) {
      throw new Error("Could not find Back button on Works page");
    }

    console.log("Clicking Back button...");
    await backBtn.click();

    console.log("Waiting for return to homepage...");
    let returned = false;
    for (let i = 0; i < 50; i++) {
      const url = page.url();
      if (!url.includes('/works')) {
        returned = true;
        console.log(`Returned to homepage: ${url} in ${Date.now() - clickTime}ms`);
        break;
      }
      await new Promise(r => setTimeout(r, 100));
    }

    console.log("Waiting 3 seconds for homepage returning animation and scroll restoration...");
    await new Promise(r => setTimeout(r, 3000));

    const finalScrollY = await page.evaluate(() => window.scrollY);
    console.log(`Final scroll position on homepage: ${finalScrollY} (expected close to ${scrollYAfterScroll})`);

  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
})();
