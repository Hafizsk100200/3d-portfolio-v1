module.paths.push('c:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\node_modules');

const puppeteer = require('puppeteer-core');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log("Launching browser to inspect original site...");
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log("Navigating to https://lukebaffait.fr/ ...");
  try {
    await page.goto('https://lukebaffait.fr/', { waitUntil: 'networkidle2', timeout: 30000 });
    console.log("Original site loaded. Waiting 5s for intro...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Scroll to 10000px (or similar gallery scroll position)
    console.log("Scrolling to 10000px on original site...");
    await page.evaluate(() => window.scrollTo(0, 10000));
    await new Promise(resolve => setTimeout(resolve, 1000));

    const originalStats = await page.evaluate(() => {
      // Find the gallery pin element on the original site
      const pin = document.querySelector('[id*="gallery-pin"]') || document.querySelector('.circle-gallery-pin') || document.querySelector('#circle-gallery-pin');
      const container = document.querySelector('.circle-gallery') || document.querySelector('#circle-gallery');
      const spacer = pin ? pin.parentElement : null;

      // Find GSAP ScrollTriggers
      const stData = [];
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((st, i) => {
          if (st.pin === pin || (st.trigger && st.trigger.id === 'circle-gallery')) {
            stData.push({
              index: i,
              trigger: st.trigger ? st.trigger.id || st.trigger.className : 'none',
              start: st.start,
              end: st.end,
              progress: st.progress,
              isActive: st.isActive,
            });
          }
        });
      }

      return {
        pinExists: !!pin,
        pinTagName: pin ? pin.tagName.toLowerCase() : null,
        pinId: pin ? pin.id : null,
        pinClass: pin ? pin.className : null,
        pinInlineStyle: pin ? pin.style.cssText : null,
        pinComputedStyle: pin ? {
          position: window.getComputedStyle(pin).position,
          transform: window.getComputedStyle(pin).transform,
          top: window.getComputedStyle(pin).top,
        } : null,
        spacerClass: spacer ? spacer.className : null,
        spacerInlineStyle: spacer ? spacer.style.cssText : null,
        stData: stData,
        scrollY: window.scrollY,
      };
    });

    console.log("Original site diagnostics at scrollY=10000:");
    console.log(JSON.stringify(originalStats, null, 2));

  } catch (err) {
    console.error("Inspect original failed:", err);
  } finally {
    await browser.close();
  }
})();
