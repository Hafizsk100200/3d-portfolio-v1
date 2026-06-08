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
    console.log("Navigating to http://localhost:4174/ ...");
    await page.goto('http://localhost:4174/', { waitUntil: 'load', timeout: 20000 });
    console.log("Page loaded. Waiting 5 seconds...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    const globals = await page.evaluate(() => {
      return {
        hasCoreRenderer: typeof window.CoreRenderer !== 'undefined',
        coreRendererType: typeof window.CoreRenderer,
        hasHeroProjectData: typeof window._heroProjectData !== 'undefined',
        hasGsap: typeof window.gsap !== 'undefined',
        hasScrollTrigger: typeof window.ScrollTrigger !== 'undefined',
        hasLenis: typeof window.Lenis !== 'undefined',
        scripts: Array.from(document.querySelectorAll('script')).map(s => s.src)
      };
    });

    console.log("\n--- LOCAL PREVIEW GLOBAL VARIABLES ---");
    console.log(JSON.stringify(globals, null, 2));

  } catch (err) {
    console.error("Failed:", err.message);
  } finally {
    await browser.close();
  }
})();
