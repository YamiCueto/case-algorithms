const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.resolve('C:/Users/YAMI/.gemini/antigravity-ide/brain/6505d361-5113-464e-b8d9-f5ffe41a0ad5/scratch/consolidation_audit');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runConsolidationAudit() {
  console.log('=== STARTING CONSOLIDATION AUDIT (LOCAL & PROD) ===');
  const browser = await chromium.launch({ headless: true });

  // ----------------------------------------------------
  // PART 1: LOCAL ENVIRONMENT AUDIT (http://localhost:4174/case-algorithms/)
  // ----------------------------------------------------
  console.log('\n--- Auditing Local Preview Environment ---');
  const localContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const localPage = await localContext.newPage();

  const localConsoleErrors = [];
  localPage.on('console', (msg) => {
    if (msg.type() === 'error') {
      localConsoleErrors.push(msg.text());
    }
  });

  const localFailedRequests = [];
  localPage.on('response', (response) => {
    if (response.status() >= 400) {
      localFailedRequests.push(`${response.status()} ${response.url()}`);
    }
  });

  await localPage.goto('http://localhost:4174/case-algorithms/', { waitUntil: 'networkidle' });

  // ARRAY LAB AUDIT
  console.log('1. Auditing ArrayLab...');
  await localPage.getByRole('button', { name: /switch to array laboratory/i }).click();
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '01_array_initial_desktop.png'), fullPage: true });

  await localPage.keyboard.press('ArrowRight'); // Step 1: compare
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '02_array_compare_desktop.png'), fullPage: true });

  await localPage.keyboard.press('ArrowRight'); // Step 2: swap
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '03_array_swap_desktop.png'), fullPage: true });

  await localPage.keyboard.press('End'); // Final: sorted
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '04_array_sorted_desktop.png'), fullPage: true });

  // Array custom input
  const arrayInput = localPage.getByLabel(/array input values/i);
  await arrayInput.fill('9, 3, 7, 1, 5');
  await localPage.getByRole('button', { name: /load and run/i }).click();
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '05_array_custom_input_desktop.png'), fullPage: true });

  // Array invalid input
  await arrayInput.fill('abc, xyz');
  await localPage.getByRole('button', { name: /load and run/i }).click();
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '06_array_invalid_input_desktop.png'), fullPage: true });

  // STACK LAB AUDIT
  console.log('2. Auditing StackLab...');
  await localPage.getByRole('button', { name: /switch to stack laboratory/i }).click();
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '07_stack_initial_desktop.png'), fullPage: true });

  await localPage.keyboard.press('ArrowRight'); // Push
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '08_stack_push_desktop.png'), fullPage: true });

  await localPage.keyboard.press('ArrowRight'); // Push 20
  await localPage.keyboard.press('ArrowRight'); // Push 30
  await localPage.keyboard.press('ArrowRight'); // Pop
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '09_stack_pop_desktop.png'), fullPage: true });

  await localPage.keyboard.press('ArrowRight'); // Push 40
  await localPage.keyboard.press('ArrowRight'); // Peek
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '10_stack_peek_desktop.png'), fullPage: true });

  // Stack Overflow Demo
  await localPage.getByRole('button', { name: /overflow demo/i }).click();
  await localPage.waitForTimeout(200);
  await localPage.keyboard.press('End');
  await localPage.keyboard.press('ArrowLeft'); // step into OVERFLOW
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '11_stack_overflow_desktop.png'), fullPage: true });

  // Stack Underflow Demo
  await localPage.getByRole('button', { name: /underflow demo/i }).click();
  await localPage.waitForTimeout(200);
  await localPage.keyboard.press('End');
  await localPage.keyboard.press('ArrowLeft'); // step into UNDERFLOW
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '12_stack_underflow_desktop.png'), fullPage: true });

  // QUEUE LAB AUDIT
  console.log('3. Auditing QueueLab...');
  await localPage.getByRole('button', { name: /switch to queue laboratory/i }).click();
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '13_queue_initial_desktop.png'), fullPage: true });

  await localPage.keyboard.press('ArrowRight'); // Enqueue 10
  await localPage.keyboard.press('ArrowRight'); // Enqueue 20
  await localPage.keyboard.press('ArrowRight'); // Enqueue 30
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '14_queue_enqueue_desktop.png'), fullPage: true });

  await localPage.keyboard.press('ArrowRight'); // Dequeue 10 (O(1) buffer)
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '15_queue_dequeue_desktop.png'), fullPage: true });

  await localPage.keyboard.press('ArrowRight'); // Enqueue 40
  await localPage.keyboard.press('ArrowRight'); // Peek Front
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '16_queue_peek_desktop.png'), fullPage: true });

  // Queue Overflow Demo
  await localPage.getByRole('button', { name: /overflow demo/i }).click();
  await localPage.waitForTimeout(200);
  await localPage.keyboard.press('End');
  await localPage.keyboard.press('ArrowLeft');
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '17_queue_overflow_desktop.png'), fullPage: true });

  // Queue Underflow Demo
  await localPage.getByRole('button', { name: /underflow demo/i }).click();
  await localPage.waitForTimeout(200);
  await localPage.keyboard.press('End');
  await localPage.keyboard.press('ArrowLeft');
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '18_queue_underflow_desktop.png'), fullPage: true });

  // Queue CodeViewer sync check (Pseudocode & TypeScript)
  await localPage.getByRole('button', { name: /standard/i }).click();
  await localPage.waitForTimeout(200);
  await localPage.keyboard.press('Home');
  await localPage.keyboard.press('ArrowRight'); // Step 1 ENQUEUE

  await localPage.getByRole('button', { name: /06\. pseudocode/i }).click();
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '19_queue_pseudocode_sync_desktop.png'), fullPage: true });

  await localPage.getByRole('button', { name: /07\. code/i }).click();
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '20_queue_code_sync_desktop.png'), fullPage: true });

  // VIEWPORTS AUDIT (Desktop, Laptop, Tablet, Mobile)
  console.log('4. Auditing Multi-Viewports...');
  // Laptop 1280x720
  await localPage.setViewportSize({ width: 1280, height: 720 });
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '21_viewport_laptop_1280x720.png'), fullPage: true });

  // Tablet 768x1024
  await localPage.setViewportSize({ width: 768, height: 1024 });
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '22_viewport_tablet_768x1024.png'), fullPage: true });

  // Mobile 390x844
  await localPage.setViewportSize({ width: 390, height: 844 });
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '23_viewport_mobile_queue_390x844.png'), fullPage: true });

  await localPage.getByRole('button', { name: /switch to stack laboratory/i }).click();
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '24_viewport_mobile_stack_390x844.png'), fullPage: true });

  await localPage.getByRole('button', { name: /switch to array laboratory/i }).click();
  await localPage.waitForTimeout(200);
  await localPage.screenshot({ path: path.join(SCREENSHOT_DIR, '25_viewport_mobile_array_390x844.png'), fullPage: true });

  console.log(`Local Audit Finished. Console Errors: ${localConsoleErrors.length}, Failed HTTP: ${localFailedRequests.length}`);
  await localContext.close();

  // ----------------------------------------------------
  // PART 2: PRODUCTION ENVIRONMENT AUDIT (https://yamicueto.github.io/case-algorithms/)
  // ----------------------------------------------------
  console.log('\n--- Auditing Production Environment (GitHub Pages) ---');
  const prodContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const prodPage = await prodContext.newPage();

  const prodConsoleErrors = [];
  prodPage.on('console', (msg) => {
    if (msg.type() === 'error') {
      prodConsoleErrors.push(msg.text());
    }
  });

  const prodFailedRequests = [];
  prodPage.on('response', (response) => {
    if (response.status() >= 400) {
      prodFailedRequests.push(`${response.status()} ${response.url()}`);
    }
  });

  const prodResponse = await prodPage.goto('https://yamicueto.github.io/case-algorithms/', { waitUntil: 'networkidle' });
  const prodStatus = prodResponse ? prodResponse.status() : 'NO_RESPONSE';

  console.log(`Production HTTP Status: ${prodStatus}`);

  // Prod Array
  await prodPage.screenshot({ path: path.join(SCREENSHOT_DIR, '26_prod_queue_default_desktop.png'), fullPage: true });

  // Prod Switch to Stack
  await prodPage.getByRole('button', { name: /switch to stack laboratory/i }).click();
  await prodPage.waitForTimeout(300);
  await prodPage.screenshot({ path: path.join(SCREENSHOT_DIR, '27_prod_stack_desktop.png'), fullPage: true });

  // Prod Switch to Array
  await prodPage.getByRole('button', { name: /switch to array laboratory/i }).click();
  await prodPage.waitForTimeout(300);
  await prodPage.screenshot({ path: path.join(SCREENSHOT_DIR, '28_prod_array_desktop.png'), fullPage: true });

  // Prod Mobile
  await prodPage.setViewportSize({ width: 390, height: 844 });
  await prodPage.waitForTimeout(200);
  await prodPage.screenshot({ path: path.join(SCREENSHOT_DIR, '29_prod_mobile_390x844.png'), fullPage: true });

  console.log(`Production Audit Finished. HTTP Status: ${prodStatus}, Console Errors: ${prodConsoleErrors.length}, Failed HTTP: ${prodFailedRequests.length}`);

  await prodContext.close();
  await browser.close();

  const auditReport = {
    local: {
      consoleErrors: localConsoleErrors,
      failedRequests: localFailedRequests,
    },
    prod: {
      httpStatus: prodStatus,
      consoleErrors: prodConsoleErrors,
      failedRequests: prodFailedRequests,
    },
  };

  fs.writeFileSync(
    path.join(SCREENSHOT_DIR, 'audit-results.json'),
    JSON.stringify(auditReport, null, 2)
  );

  console.log('\n=== CONSOLIDATION AUDIT COMPLETED SUCCESSFULLY ===');
}

runConsolidationAudit().catch((err) => {
  console.error('Consolidation audit failed:', err);
  process.exit(1);
});
