const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log(`[BROWSER ERROR]: ${err.message}`);
    console.log(err.stack);
  });
  
  page.on('requestfailed', request => {
    console.log(`[FAILED DATA/REQ]: ${request.url()} - ${request.failure()?.errorText || 'failed'}`);
  });

  try {
    console.log("Navigating to register page...");
    await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle', timeout: 8000 });
    console.log("Navigation finished.");
    const html = await page.content();
    console.log("HTML length:", html.length);
  } catch (err) {
    console.error("Navigation error:", err.message);
  } finally {
    await browser.close();
  }
})();
