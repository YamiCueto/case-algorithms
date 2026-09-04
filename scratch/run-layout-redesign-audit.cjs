const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');

const distDir = path.resolve(__dirname, '../dist');
const screenshotDir = path.resolve(
  'C:/Users/YAMI/.gemini/antigravity-ide/brain/6505d361-5113-464e-b8d9-f5ffe41a0ad5/scratch/layout_redesign_audit'
);

if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html';
    case '.js': return 'application/javascript';
    case '.css': return 'text/css';
    case '.svg': return 'image/svg+xml';
    case '.json': return 'application/json';
    case '.png': return 'image/png';
    default: return 'application/octet-stream';
  }
}

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath.startsWith('/case-algorithms/')) {
    reqPath = reqPath.replace('/case-algorithms/', '/');
  } else if (reqPath === '/case-algorithms') {
    reqPath = '/';
  }

  let filePath = path.join(distDir, reqPath === '/' ? 'index.html' : reqPath);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, 'index.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': getContentType(filePath) });
    res.end(data);
  });
});

const PORT = 4176;

server.listen(PORT, async () => {
  console.log(`Server listening on http://localhost:${PORT}/case-algorithms/`);
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto(`http://localhost:${PORT}/case-algorithms/`);
    await page.waitForSelector('.lab-shell');
    await page.waitForTimeout(300);

    // 01: Desktop Array Initial Dual Stage
    await page.screenshot({ path: path.join(screenshotDir, '01_array_initial_desktop_1440x900.png') });

    // 02: Array Step Forward -> Compare
    await page.click('button:has-text("Step >")');
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, '02_array_compare_pseudocode_1440x900.png') });

    // 03: Switch to TypeScript in Code Stage
    await page.click('.code-stage-panel button:has-text("TypeScript")');
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, '03_array_compare_typescript_1440x900.png') });

    // 04: Array Step Forward -> Swap
    await page.click('button:has-text("Step >")');
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, '04_array_swap_typescript_1440x900.png') });

    // 05: Array Jump to End -> Sorted Complete
    await page.click('button:has-text(">|")');
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, '05_array_complete_1440x900.png') });

    // 06: Switch to StackLab
    await page.click('button:has-text("Stack (LIFO)")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotDir, '06_stack_initial_desktop_1440x900.png') });

    // 07: Stack Step Forward -> Push 10
    await page.click('button:has-text("Step >")');
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, '07_stack_push_step_1440x900.png') });

    // 08: Stack Pop Preset Demo
    await page.click('button:has-text("Peek & Inspect")');
    await page.waitForTimeout(300);
    await page.click('button:has-text(">|")');
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, '08_stack_peek_inspect_1440x900.png') });

    // 09: Switch to QueueLab
    await page.click('button:has-text("Queue (FIFO)")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotDir, '09_queue_initial_desktop_1440x900.png') });

    // 10: Queue Step Forward -> Enqueue
    await page.click('button:has-text("Step >")');
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, '10_queue_enqueue_step_1440x900.png') });

    // 11: Queue Wrap-Around Preset
    await page.click('button:has-text("Wrap-Around Demo")');
    await page.waitForTimeout(300);
    await page.click('button:has-text(">|")');
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, '11_queue_wraparound_final_1440x900.png') });

    // 12: Switch to Linked List Lab
    await page.click('button:has-text("Linked List")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotDir, '12_linked_list_initial_desktop_1440x900.png') });

    // 13: Linked List Step Forward
    await page.click('button:has-text("Step >")');
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, '13_linked_list_step1_1440x900.png') });

    // 14: Linked List End
    await page.click('button:has-text(">|")');
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, '14_linked_list_end_1440x900.png') });

    // 15: Viewport Laptop 1280x720 (Array)
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.click('button:has-text("Array & Bubble Sort")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotDir, '15_viewport_laptop_1280x720_array.png') });

    // 16: Viewport Tablet 768x1024 (Stack)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.click('button:has-text("Stack (LIFO)")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotDir, '16_viewport_tablet_768x1024_stack.png') });

    // 17: Viewport Mobile 390x844 (Array)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.click('button:has-text("Array & Bubble Sort")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotDir, '17_viewport_mobile_390x844_array.png') });

    // 18: Viewport Mobile 390x844 (Queue)
    await page.click('button:has-text("Queue (FIFO)")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotDir, '18_viewport_mobile_390x844_queue.png') });

    // 19: Viewport Mobile 390x844 (Linked List)
    await page.click('button:has-text("Linked List")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotDir, '19_viewport_mobile_390x844_linked_list.png') });

    console.log('Visual audit finished successfully. Screenshots saved.');
    console.log('Console errors count:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors);
    }
  } catch (err) {
    console.error('Audit failed:', err);
  } finally {
    await browser.close();
    server.close();
  }
});
