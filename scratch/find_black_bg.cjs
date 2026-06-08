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

  await page.goto('http://localhost:5176/', { waitUntil: 'load' });
  await new Promise(resolve => setTimeout(resolve, 6000)); // wait for preloader

  // Scroll to 1200px
  await page.evaluate(() => {
    window.scrollTo(0, 1200);
  });
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Find all elements and their backgrounds/z-indices
  const elements = await page.evaluate(() => {
    const list = [];
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;

      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      const bgImg = style.backgroundImage;
      const opacity = style.opacity;
      const zIndex = style.zIndex;
      const display = style.display;
      const vis = style.visibility;

      // We care about elements that are visible and might be overlaying
      if (display !== 'none' && vis !== 'hidden' && parseFloat(opacity) > 0) {
        list.push({
          tag: el.tagName,
          id: el.id,
          class: el.className,
          zIndex: zIndex,
          opacity: opacity,
          bg: bg,
          bgImg: bgImg,
          position: style.position,
          rect: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          }
        });
      }
    }
    return list;
  });

  console.log("=== VISIBLE ELEMENTS AT SCROLL 1200px ===");
  elements.forEach(el => {
    // Look for elements that cover a significant portion of the screen
    if (el.rect.width > 500 && el.rect.height > 500) {
      console.log(`${el.tag}#${el.id}.${el.class} [zIndex: ${el.zIndex}, opacity: ${el.opacity}, pos: ${el.position}]`);
      console.log(`  Bg: ${el.bg} | BgImg: ${el.bgImg}`);
      console.log(`  Rect: top=${el.rect.top}, left=${el.rect.left}, w=${el.rect.width}, h=${el.rect.height}`);
    }
  });

  await browser.close();
})();
