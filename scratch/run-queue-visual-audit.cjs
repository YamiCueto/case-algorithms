const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.resolve('C:/Users/YAMI/.gemini/antigravity-ide/brain/6505d361-5113-464e-b8d9-f5ffe41a0ad5/scratch/queue_screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runQueueVisualAudit() {
  console.log('Starting Playwright Queue Visual Audit on http://localhost:4174/case-algorithms/...');
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:4174/case-algorithms/', { waitUntil: 'networkidle' });

  // 1. Initial State (Default Queue Lab)
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_queue_initial_desktop.png'), fullPage: true });
  console.log('Captured 01_queue_initial_desktop.png');

  // 2. Step forward (Step 1: Enqueue 10)
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_queue_step_enqueue_10_desktop.png'), fullPage: true });
  console.log('Captured 02_queue_step_enqueue_10_desktop.png');

  // 3. Step forward (Step 2: Enqueue 20)
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_queue_step_enqueue_20_desktop.png'), fullPage: true });
  console.log('Captured 03_queue_step_enqueue_20_desktop.png');

  // 4. Step forward (Step 3: Enqueue 30)
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_queue_step_enqueue_30_desktop.png'), fullPage: true });
  console.log('Captured 04_queue_step_enqueue_30_desktop.png');

  // 5. Step forward (Step 4: Dequeue 10)
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_queue_step_dequeue_desktop.png'), fullPage: true });
  console.log('Captured 05_queue_step_dequeue_desktop.png');

  // 6. Step forward (Step 5: Enqueue 40)
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);

  // 7. Step forward (Step 6: Peek Front)
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_queue_step_peek_front_desktop.png'), fullPage: true });
  console.log('Captured 06_queue_step_peek_front_desktop.png');

  // 8. Overflow Demo Preset
  const overflowPresetBtn = page.getByRole('button', { name: /overflow demo/i });
  await overflowPresetBtn.click();
  await page.waitForTimeout(200);
  // jump to overflow step (last step)
  await page.keyboard.press('End');
  await page.keyboard.press('ArrowLeft'); // step into OVERFLOW
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_queue_overflow_desktop.png'), fullPage: true });
  console.log('Captured 07_queue_overflow_desktop.png');

  // 9. Underflow Demo Preset
  const underflowPresetBtn = page.getByRole('button', { name: /underflow demo/i });
  await underflowPresetBtn.click();
  await page.waitForTimeout(200);
  await page.keyboard.press('End');
  await page.keyboard.press('ArrowLeft'); // step into UNDERFLOW
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_queue_underflow_desktop.png'), fullPage: true });
  console.log('Captured 08_queue_underflow_desktop.png');

  // 10. Pedagogical Phases: 06. Pseudocode & 07. Code
  await page.getByRole('button', { name: /standard/i }).click();
  await page.waitForTimeout(200);
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight'); // Step 1 ENQUEUE

  await page.getByRole('button', { name: /06\. pseudocode/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_queue_phase_pseudocode_desktop.png'), fullPage: true });
  console.log('Captured 09_queue_phase_pseudocode_desktop.png');

  await page.getByRole('button', { name: /07\. code/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_queue_phase_code_desktop.png'), fullPage: true });
  console.log('Captured 10_queue_phase_code_desktop.png');

  // 11. Viewports
  // Laptop 1280x720
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_queue_viewport_laptop_1280x720.png'), fullPage: true });
  console.log('Captured 11_queue_viewport_laptop_1280x720.png');

  // Tablet 768x1024
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_queue_viewport_tablet_768x1024.png'), fullPage: true });
  console.log('Captured 12_queue_viewport_tablet_768x1024.png');

  // Mobile 390x844
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_queue_viewport_mobile_390x844.png'), fullPage: true });
  console.log('Captured 13_queue_viewport_mobile_390x844.png');

  // 12. Regression verification: Switch to Array Lab & Stack Lab
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole('button', { name: /switch to array laboratory/i }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14_regression_array_lab_desktop.png'), fullPage: true });
  console.log('Captured 14_regression_array_lab_desktop.png');

  await page.getByRole('button', { name: /switch to stack laboratory/i }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '15_regression_stack_lab_desktop.png'), fullPage: true });
  console.log('Captured 15_regression_stack_lab_desktop.png');

  await context.close();
  await browser.close();

  console.log('Queue Playwright Visual Audit completed successfully!');
}

runQueueVisualAudit().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
