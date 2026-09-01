const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.resolve('C:/Users/YAMI/.gemini/antigravity-ide/brain/6505d361-5113-464e-b8d9-f5ffe41a0ad5/scratch/a11y_screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runA11yAudit() {
  console.log('Starting Playwright A11y & Keyboard Audit on http://localhost:4174/case-algorithms/...');
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:4174/case-algorithms/', { waitUntil: 'networkidle' });

  // Explicitly select Array & Bubble Sort
  await page.getByRole('button', { name: /switch to array laboratory/i }).click();
  await page.waitForTimeout(200);

  // 1. Initial State Screenshot & Live Region Check
  const liveRegion = page.getByRole('status');
  const initialText = await liveRegion.textContent();
  console.log(`Initial Live Region Text: "${initialText}"`);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_array_initial_a11y_desktop.png'), fullPage: true });
  console.log('Captured 01_array_initial_a11y_desktop.png');

  // 2. Keyboard Navigation: ArrowRight (step 1 compare)
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  const step1Text = await liveRegion.textContent();
  console.log(`After ArrowRight Live Region Text: "${step1Text}"`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_array_arrowright_compare_desktop.png'), fullPage: true });
  console.log('Captured 02_array_arrowright_compare_desktop.png');

  // 3. Keyboard Navigation: ArrowRight again (step 2 swap)
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  const step2Text = await liveRegion.textContent();
  console.log(`After second ArrowRight Live Region Text: "${step2Text}"`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_array_arrowright_swap_desktop.png'), fullPage: true });
  console.log('Captured 03_array_arrowright_swap_desktop.png');

  // 4. Keyboard Navigation: ArrowLeft (step back)
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(200);
  const stepBackText = await liveRegion.textContent();
  console.log(`After ArrowLeft Live Region Text: "${stepBackText}"`);

  // 5. Keyboard Navigation: End (jump to final step)
  await page.keyboard.press('End');
  await page.waitForTimeout(200);
  const endText = await liveRegion.textContent();
  console.log(`After End key Live Region Text: "${endText}"`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_array_end_key_complete_desktop.png'), fullPage: true });
  console.log('Captured 04_array_end_key_complete_desktop.png');

  // 6. Keyboard Navigation: Home (jump to first step)
  await page.keyboard.press('Home');
  await page.waitForTimeout(200);
  const homeText = await liveRegion.textContent();
  console.log(`After Home key Live Region Text: "${homeText}"`);

  // 7. Keyboard Navigation: Space (toggle Play)
  await page.keyboard.press('Space');
  await page.waitForTimeout(700);
  await page.keyboard.press('Space'); // pause
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_array_space_play_pause_desktop.png'), fullPage: true });
  console.log('Captured 05_array_space_play_pause_desktop.png');

  // 8. Keyboard Navigation: r (reset)
  await page.keyboard.press('r');
  await page.waitForTimeout(200);
  const resetText = await liveRegion.textContent();
  console.log(`After 'r' key Live Region Text: "${resetText}"`);

  // 9. Input typing isolation test
  const inputField = page.getByRole('textbox', { name: /array input values/i });
  await inputField.focus();
  await page.keyboard.type(' 1, 2, 3');
  await page.waitForTimeout(200);
  const inputValue = await inputField.inputValue();
  console.log(`Input Field Value After Typing: "${inputValue}"`);

  // 10. Switch to Stack Laboratory
  const stackSwitchBtn = page.getByRole('button', { name: /switch to stack laboratory/i });
  await stackSwitchBtn.click();
  await page.waitForTimeout(300);

  const stackLiveRegion = page.getByRole('status');
  const stackInitialText = await stackLiveRegion.textContent();
  console.log(`Stack Initial Live Region Text: "${stackInitialText}"`);

  // Stack Keyboard Step
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  const stackStep1Text = await stackLiveRegion.textContent();
  console.log(`Stack After ArrowRight Text: "${stackStep1Text}"`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_stack_arrowright_push_desktop.png'), fullPage: true });
  console.log('Captured 06_stack_arrowright_push_desktop.png');

  // Stack Keyboard End
  await page.keyboard.press('End');
  await page.waitForTimeout(200);
  const stackEndText = await stackLiveRegion.textContent();
  console.log(`Stack After End Text: "${stackEndText}"`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_stack_end_key_desktop.png'), fullPage: true });
  console.log('Captured 07_stack_end_key_desktop.png');

  await context.close();
  await browser.close();

  console.log('Local A11y & Keyboard Audit completed successfully!');
}

runA11yAudit().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
