const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[CONSOLE] [${msg.type().toUpperCase()}] ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log(`[ERROR] ${err.message}`);
    console.log(err.stack);
  });
  
  page.on('requestfailed', request => {
    console.log(`[REQ FAILED] ${request.url()} - ${request.failure()?.errorText || 'failed'}`);
  });

  try {
    console.log("Navigating to http://localhost:5173/register...");
    await page.goto('http://localhost:5173/register', { waitUntil: 'domcontentloaded', timeout: 5000 });
    console.log("Navigation complete, waiting 3s...");
    await page.waitForTimeout(3000);
    const html = await page.content();
    console.log("HTML length:", html.length);
  } catch (err) {
    console.error("Error during execution:", err.message);
  } finally {
    await browser.close();
  }
})();
