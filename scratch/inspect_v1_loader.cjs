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
    console.log("Navigating to https://hafiz-sk-portfolio.vercel.app ...");
    await page.goto('https://hafiz-sk-portfolio.vercel.app', { waitUntil: 'load', timeout: 20000 });
    console.log("Page loaded. Waiting 10 seconds for loading to progress...");
    await new Promise(resolve => setTimeout(resolve, 10000));

    const progressState = await page.evaluate(() => {
      // Find the React component state. Since we cannot easily inspect React state directly
      // from window in production without devtools, we can inspect the DOM text content
      // or evaluate the status of the images or fonts.
      
      // Let's check image loading status manually in document
      const images = Array.from(document.querySelectorAll('img'));
      const imageLoadStatus = images.map(img => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth
      }));

      // Let's count how many images in the document are not complete
      const incompleteImages = imageLoadStatus.filter(img => !img.complete);

      // Check document fonts status
      const fontsStatus = document.fonts.status;

      // Find the loading text content
      const loadingText = document.body.innerText;

      return {
        totalImagesInDom: images.length,
        incompleteImagesCount: incompleteImages.length,
        incompleteImagesList: incompleteImages,
        fontsStatus,
        loadingText: loadingText.substring(0, 500)
      };
    });

    console.log("\n--- V1 LOADER DETAILED STATUS ---");
    console.log(JSON.stringify(progressState, null, 2));

  } catch (err) {
    console.error("Failed:", err.message);
  } finally {
    await browser.close();
  }
})();
