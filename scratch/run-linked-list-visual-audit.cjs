const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.resolve('C:/Users/YAMI/.gemini/antigravity-ide/brain/6505d361-5113-464e-b8d9-f5ffe41a0ad5/scratch/linked_list_screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runLinkedListVisualAudit() {
  console.log('=== STARTING LINKED LIST PLAYWRIGHT VISUAL AUDIT ===');
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  const failedRequests = [];
  page.on('response', (response) => {
    if (response.status() >= 400) {
      failedRequests.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto('http://localhost:4174/case-algorithms/', { waitUntil: 'networkidle' });

  // 1. Initial State (Default Linked List Lab)
  console.log('1. Capturing Initial State...');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_linked_list_initial_desktop.png'), fullPage: true });

  // 2. Empty List State (Click Clear)
  console.log('2. Capturing Empty State...');
  await page.getByRole('button', { name: /clear linked list/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_linked_list_empty_desktop.png'), fullPage: true });

  // 3. User Prepend 10
  console.log('3. Capturing Prepend...');
  const valInput = page.getByLabel(/node value input/i);
  await valInput.fill('10');
  await page.getByRole('button', { name: /prepend node at head/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_linked_list_prepend_10_desktop.png'), fullPage: true });

  // 4. User Append 20 & 30
  console.log('4. Capturing Append...');
  await valInput.fill('20');
  await page.getByRole('button', { name: /append node at tail/i }).click();
  await page.waitForTimeout(200);

  await valInput.fill('30');
  await page.getByRole('button', { name: /append node at tail/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_linked_list_append_30_desktop.png'), fullPage: true });

  // 5. User Insert At 1 (Value 15)
  console.log('5. Capturing Insert At...');
  const idxInput = page.getByLabel(/node index input/i);
  await valInput.fill('15');
  await idxInput.fill('1');
  await page.getByRole('button', { name: /insert node at index/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_linked_list_insert_15_desktop.png'), fullPage: true });

  // 6. User Remove At 2
  console.log('6. Capturing Remove At...');
  await idxInput.fill('2');
  await page.getByRole('button', { name: /remove node at index/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_linked_list_remove_at_2_desktop.png'), fullPage: true });

  // 7. User Find 15 (Found match)
  console.log('7. Capturing Find...');
  await valInput.fill('15');
  await page.getByRole('button', { name: /find value in list/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_linked_list_find_15_desktop.png'), fullPage: true });

  // 8. Removal Demo Preset (Head & Tail Removal)
  console.log('8. Capturing Head/Tail Removal Preset...');
  await page.getByRole('button', { name: /removal demo/i }).click();
  await page.waitForTimeout(200);
  await page.keyboard.press('End'); // Final step
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_linked_list_removal_preset_final_desktop.png'), fullPage: true });

  // 9. Time-Travel Step Backwards to inspect HEAD removal
  console.log('9. Capturing Head Removal Step...');
  await page.keyboard.press('ArrowLeft'); // Step into REMOVE_AT head
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_linked_list_head_removal_step_desktop.png'), fullPage: true });

  // 10. CodeViewer Sync (Pseudocode & Code)
  console.log('10. Capturing CodeViewer Sync...');
  await page.getByRole('button', { name: /standard/i }).click();
  await page.waitForTimeout(200);
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight'); // Step 1 PREPEND

  await page.getByRole('button', { name: /06\. pseudocode/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_linked_list_phase_pseudocode_desktop.png'), fullPage: true });

  await page.getByRole('button', { name: /07\. code/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_linked_list_phase_code_desktop.png'), fullPage: true });

  // 11. Error State (Invalid Index Out of Bounds)
  console.log('11. Capturing Error State...');
  await idxInput.fill('99');
  await page.getByRole('button', { name: /remove node at index/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_linked_list_error_state_desktop.png'), fullPage: true });

  // 12. Multi-Viewports
  console.log('12. Capturing Multi-Viewports...');
  // Laptop 1280x720
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_viewport_laptop_1280x720.png'), fullPage: true });

  // Tablet 768x1024
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14_viewport_tablet_768x1024.png'), fullPage: true });

  // Mobile 390x844
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '15_viewport_mobile_linked_list_390x844.png'), fullPage: true });

  // 13. Non-regression: Switch to Queue, Stack, Array
  console.log('13. Capturing Non-Regression existing Labs...');
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.getByRole('button', { name: /switch to queue laboratory/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '16_regression_queue_lab_desktop.png'), fullPage: true });

  await page.getByRole('button', { name: /switch to stack laboratory/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '17_regression_stack_lab_desktop.png'), fullPage: true });

  await page.getByRole('button', { name: /switch to array laboratory/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '18_regression_array_lab_desktop.png'), fullPage: true });

  console.log(`Linked List Visual Audit Finished. Console Errors: ${consoleErrors.length}, Failed HTTP: ${failedRequests.length}`);

  await context.close();
  await browser.close();

  fs.writeFileSync(
    path.join(SCREENSHOT_DIR, 'audit-results.json'),
    JSON.stringify({ consoleErrors, failedRequests }, null, 2)
  );

  console.log('=== LINKED LIST PLAYWRIGHT AUDIT COMPLETED ===');
}

runLinkedListVisualAudit().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
