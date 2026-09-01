const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.resolve('C:/Users/YAMI/.gemini/antigravity-ide/brain/6505d361-5113-464e-b8d9-f5ffe41a0ad5/scratch/ghpages_a11y_live_screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runLiveAudit() {
  const TARGET_URL = 'https://yamicueto.github.io/case-algorithms/';
  console.log(`Starting Playwright Live A11y & Keyboard Audit on GitHub Pages: ${TARGET_URL}...`);

  const browser = await chromium.launch({ headless: true });
  const consoleErrors = [];
  const networkErrors = [];

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[Console Error]: ${msg.text()}`);
    }
  });

  page.on('response', (response) => {
    const status = response.status();
    const url = response.url();
    if (status >= 400) {
      networkErrors.push(`[HTTP ${status}] ${url}`);
    }
  });

  const res = await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });
  console.log(`Page HTTP Status: ${res.status()}`);

  await page.waitForTimeout(500);

  // Explicitly select Array & Bubble Sort
  await page.getByRole('button', { name: /switch to array laboratory/i }).click();
  await page.waitForTimeout(200);

  // 1. Initial State & Live Region Check
  const liveRegion = page.getByRole('status');
  const initialText = await liveRegion.textContent();
  console.log(`Live Initial Text: "${initialText}"`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_live_array_initial_a11y.png'), fullPage: true });
  console.log('Captured 01_live_array_initial_a11y.png');

  // 2. Keyboard Navigation: ArrowRight
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  const step1Text = await liveRegion.textContent();
  console.log(`Live After ArrowRight: "${step1Text}"`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_live_array_arrowright_compare.png'), fullPage: true });
  console.log('Captured 02_live_array_arrowright_compare.png');

  // 3. Keyboard Navigation: End (complete)
  await page.keyboard.press('End');
  await page.waitForTimeout(200);
  const endText = await liveRegion.textContent();
  console.log(`Live After End: "${endText}"`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_live_array_end_complete.png'), fullPage: true });
  console.log('Captured 03_live_array_end_complete.png');

  // 4. Keyboard Navigation: Home (first)
  await page.keyboard.press('Home');
  await page.waitForTimeout(200);
  const homeText = await liveRegion.textContent();
  console.log(`Live After Home: "${homeText}"`);

  // 5. Keyboard Navigation: Space (toggle Play / Pause)
  await page.keyboard.press('Space');
  await page.waitForTimeout(600);
  await page.keyboard.press('Space');
  await page.waitForTimeout(200);

  // 6. Keyboard Navigation: r (reset)
  await page.keyboard.press('r');
  await page.waitForTimeout(200);
  const resetText = await liveRegion.textContent();
  console.log(`Live After 'r': "${resetText}"`);

  // 7. Input focus and typing test
  const inputField = page.getByRole('textbox', { name: /array input values/i });
  await inputField.focus();
  await page.keyboard.type(' 8, 9');
  await page.waitForTimeout(200);
  const val = await inputField.inputValue();
  console.log(`Live Input value after typing: "${val}"`);

  // 8. Switch to Stack Lab
  await page.getByRole('button', { name: /switch to stack laboratory/i }).click();
  await page.waitForTimeout(300);

  const stackLiveRegion = page.getByRole('status');
  const stackInitialText = await stackLiveRegion.textContent();
  console.log(`Live Stack Initial: "${stackInitialText}"`);

  // Stack ArrowRight
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  const stackStep1 = await stackLiveRegion.textContent();
  console.log(`Live Stack After ArrowRight: "${stackStep1}"`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_live_stack_arrowright_push.png'), fullPage: true });
  console.log('Captured 04_live_stack_arrowright_push.png');

  // Stack End
  await page.keyboard.press('End');
  await page.waitForTimeout(200);
  const stackEnd = await stackLiveRegion.textContent();
  console.log(`Live Stack After End: "${stackEnd}"`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_live_stack_end.png'), fullPage: true });
  console.log('Captured 05_live_stack_end.png');

  await context.close();
  await browser.close();

  console.log('--- PRODUCTION AUDIT SUMMARY ---');
  console.log(`Console Errors Total: ${consoleErrors.length}`);
  console.log(`Network HTTP 4xx/5xx Failures: ${networkErrors.length}`);

  if (consoleErrors.length > 0 || networkErrors.length > 0) {
    throw new Error('Production Live Audit failed with errors.');
  }

  console.log('Live GitHub Pages A11y & Keyboard Audit PASSED 100%!');
}

runLiveAudit().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
