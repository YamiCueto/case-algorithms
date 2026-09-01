const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.resolve('C:/Users/YAMI/.gemini/antigravity-ide/brain/6505d361-5113-464e-b8d9-f5ffe41a0ad5/scratch/post_v02_audit');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runPostV02Audit() {
  console.log('=== STARTING POST-V0.2 ARCHITECTURE AUDIT PLAYWRIGHT RUN ===');
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
  console.log('1. Auditing Array Lab Desktop...');
  await page.getByRole('button', { name: /switch to array laboratory/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_array_desktop.png'), fullPage: true });

  await page.keyboard.press('ArrowRight'); // compare step
  await page.keyboard.press('ArrowRight'); // swap step
  await page.getByRole('button', { name: /06\. pseudocode/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_array_swap_pseudocode_desktop.png'), fullPage: true });

  // 2. Stack Lab (Desktop 1440x900)
  console.log('2. Auditing Stack Lab Desktop...');
  await page.getByRole('button', { name: /switch to stack laboratory/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_stack_desktop.png'), fullPage: true });

  await page.keyboard.press('End'); // complete stack
  await page.keyboard.press('ArrowLeft'); // step back
  await page.getByRole('button', { name: /07\. code/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_stack_code_sync_desktop.png'), fullPage: true });

  // 3. Queue Lab (Desktop 1440x900)
  console.log('3. Auditing Queue Lab Desktop...');
  await page.getByRole('button', { name: /switch to queue laboratory/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_queue_desktop.png'), fullPage: true });

  await page.keyboard.press('End');
  await page.keyboard.press('ArrowLeft'); // Dequeue step
  await page.getByRole('button', { name: /06\. pseudocode/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_queue_dequeue_pseudocode_desktop.png'), fullPage: true });

  // 4. Linked List Lab (Desktop 1440x900)
  console.log('4. Auditing Linked List Lab Desktop...');
  await page.getByRole('button', { name: /switch to linked list laboratory/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_linked_list_desktop.png'), fullPage: true });

  await page.keyboard.press('End'); // Final list state
  await page.getByRole('button', { name: /07\. code/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_linked_list_final_code_desktop.png'), fullPage: true });

  // 5. Mobile 390x844 on all 4 Labs
  console.log('5. Auditing Mobile 390x844 on all 4 labs...');
  await page.setViewportSize({ width: 390, height: 844 });

  await page.getByRole('button', { name: /switch to array laboratory/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_mobile_array_390x844.png'), fullPage: true });

  await page.getByRole('button', { name: /switch to stack laboratory/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_mobile_stack_390x844.png'), fullPage: true });

  await page.getByRole('button', { name: /switch to queue laboratory/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_mobile_queue_390x844.png'), fullPage: true });

  await page.getByRole('button', { name: /switch to linked list laboratory/i }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_mobile_linked_list_390x844.png'), fullPage: true });

  console.log(`Audit Finished. Console Errors: ${consoleErrors.length}, Failed HTTP: ${failedRequests.length}`);

  await context.close();
  await browser.close();

  fs.writeFileSync(
    path.join(SCREENSHOT_DIR, 'audit-summary.json'),
    JSON.stringify({ consoleErrors, failedRequests }, null, 2)
  );

  console.log('=== AUDIT RUN COMPLETED ===');
}

runPostV02Audit().catch((err) => {
  console.error('Audit run failed:', err);
  process.exit(1);
});
