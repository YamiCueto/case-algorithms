const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.resolve('C:/Users/YAMI/.gemini/antigravity-ide/brain/6505d361-5113-464e-b8d9-f5ffe41a0ad5/scratch/refactor_visual_audit');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runRefactorVisualAudit() {
  console.log('=== STARTING ISSUE #27 REFACTOR VISUAL AUDIT ===');
  const browser = await chromium.launch({ headless: true });

  const consoleErrors = [];
  const failedRequests = [];

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('response', (response) => {
    if (response.status() >= 400) {
      failedRequests.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto('http://localhost:4174/case-algorithms/', { waitUntil: 'networkidle' });

  // 1. Array Lab (Desktop 1440x900)
  console.log('1. Auditing Array Lab with Bubble Sort code highlighting...');
  await page.getByRole('button', { name: /switch to array laboratory/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_array_initial_desktop.png'), fullPage: true });

  // Select Pseudocode tab
  await page.getByRole('button', { name: /06\. pseudocode/i }).click();
  await page.waitForTimeout(150);

  // Step 1 -> COMPARE
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_array_compare_pseudocode_line6.png'), fullPage: true });

  // Switch to TypeScript code tab on COMPARE
  await page.getByRole('button', { name: /07\. code/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_array_compare_typescript_line7.png'), fullPage: true });

  // Step 2 -> SWAP
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_array_swap_typescript_line8.png'), fullPage: true });

  // Switch back to Pseudocode tab on SWAP
  await page.getByRole('button', { name: /06\. pseudocode/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_array_swap_pseudocode_line7.png'), fullPage: true });

  // Test Time Travel navigation: End key, Home key, Reset
  await page.keyboard.press('End');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_array_end_complete_desktop.png'), fullPage: true });

  await page.keyboard.press('Home');
  await page.waitForTimeout(200);

  // 2. Stack Lab (Desktop 1440x900)
  console.log('2. Auditing Stack Lab...');
  await page.getByRole('button', { name: /switch to stack laboratory/i }).click();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: /07\. code/i }).click();
  await page.waitForTimeout(150);
  await page.keyboard.press('ArrowRight'); // Step forward
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_stack_step_forward_code.png'), fullPage: true });

  // 3. Queue Lab (Desktop 1440x900)
  console.log('3. Auditing Queue Lab...');
  await page.getByRole('button', { name: /switch to queue laboratory/i }).click();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: /06\. pseudocode/i }).click();
  await page.waitForTimeout(150);
  await page.keyboard.press('End');
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_queue_dequeue_pseudocode.png'), fullPage: true });

  // 4. Linked List Lab (Desktop 1440x900)
  console.log('4. Auditing Linked List Lab...');
  await page.getByRole('button', { name: /switch to linked list laboratory/i }).click();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: /07\. code/i }).click();
  await page.waitForTimeout(150);
  await page.keyboard.press('End');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_linked_list_end_code.png'), fullPage: true });

  // 5. Mobile 390x844 Audits
  console.log('5. Auditing Mobile 390x844...');
  await page.setViewportSize({ width: 390, height: 844 });

  await page.getByRole('button', { name: /switch to array laboratory/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_mobile_array_390x844.png'), fullPage: true });

  await page.getByRole('button', { name: /switch to stack laboratory/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_mobile_stack_390x844.png'), fullPage: true });

  await page.getByRole('button', { name: /switch to queue laboratory/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_mobile_queue_390x844.png'), fullPage: true });

  await page.getByRole('button', { name: /switch to linked list laboratory/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_mobile_linked_list_390x844.png'), fullPage: true });

  console.log(`Audit Completed. Console Errors: ${consoleErrors.length}, Failed HTTP Requests: ${failedRequests.length}`);

  await context.close();
  await browser.close();

  fs.writeFileSync(
    path.join(SCREENSHOT_DIR, 'audit-results.json'),
    JSON.stringify({ consoleErrors, failedRequests }, null, 2)
  );

  console.log('=== VISUAL AUDIT RUN COMPLETED ===');
}

runRefactorVisualAudit().catch((err) => {
  console.error('Audit run error:', err);
  process.exit(1);
});
