const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');

const distDir = path.resolve(__dirname, '../dist');
const screenshotDir = path.resolve(
  'C:/Users/YAMI/.gemini/antigravity-ide/brain/6505d361-5113-464e-b8d9-f5ffe41a0ad5/scratch/shiki_audit'
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

const PORT = 4177;

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
    await page.waitForTimeout(400);

    // 01: Array Initial Desktop Dark (TypeScript syntax highlighted)
    await page.click('button:has-text("Array & Bubble Sort")');
    await page.waitForTimeout(300);
    await page.click('.code-stage-panel button:has-text("TypeScript")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotDir, '01_array_initial_dark_ts_1440x900.png') });

    // 02: Array COMPARE (Step 1)
    await page.click('button:has-text("Step >")');
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, '02_array_compare_dark_ts_1440x900.png') });

    // 03: Array SWAP (Step 2)
    await page.click('button:has-text("Step >")');
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, '03_array_swap_dark_ts_1440x900.png') });

    // 04: Array Pseudocode highlighting (Step 2 SWAP)
    await page.click('.code-stage-panel button:has-text("Pseudocode")');
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, '04_array_swap_dark_pseudocode_1440x900.png') });

    // 05: Array Light Theme Syntax Highlighting & Execution Highlight
    await page.click('.theme-toggle-btn');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotDir, '05_array_swap_light_pseudocode_1440x900.png') });

    // 06: Switch back to Dark Theme
    await page.click('.theme-toggle-btn');
    await page.waitForTimeout(300);

    // 07: Stack Lab Initial & PUSH
    await page.click('button:has-text("Stack (LIFO)")');
    await page.waitForTimeout(300);
    await page.click('.code-stage-panel button:has-text("TypeScript")');
    await page.waitForTimeout(200);
    await page.click('button:has-text("Step >")');
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, '07_stack_push_dark_ts_1440x900.png') });

    // 08: Stack Light Theme PUSH
    await page.click('.theme-toggle-btn');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotDir, '08_stack_push_light_ts_1440x900.png') });
    await page.click('.theme-toggle-btn');
    await page.waitForTimeout(300);

    // 09: Queue Lab ENQUEUE & DEQUEUE
    await page.click('button:has-text("Queue (FIFO)")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Step >")'); // Enqueue 10
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, '09_queue_enqueue_dark_ts_1440x900.png') });

    // Dequeue step (Step 4 in standard preset)
    await page.click('button:has-text("Step >")'); // Enqueue 20
    await page.waitForTimeout(100);
    await page.click('button:has-text("Step >")'); // Enqueue 30
    await page.waitForTimeout(100);
    await page.click('button:has-text("Step >")'); // Dequeue
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, '10_queue_dequeue_dark_ts_1440x900.png') });

    // 11: Linked List Lab INSERT_AT & FIND
    await page.click('button:has-text("Linked List")');
    await page.waitForTimeout(300);
    await page.click('.code-stage-panel button:has-text("TypeScript")');
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, '11_linked_list_initial_dark_ts_1440x900.png') });

    // Load Search & Traverse preset
    await page.click('button:has-text("Search & Traverse")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Step >")'); // Visit
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, '12_linked_list_find_dark_ts_1440x900.png') });

    // 13: Viewport Laptop 1280x720 (Array)
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.click('button:has-text("Array & Bubble Sort")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotDir, '13_viewport_laptop_1280x720.png') });

    // 14: Viewport Tablet 768x1024 (Stack)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.click('button:has-text("Stack (LIFO)")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotDir, '14_viewport_tablet_768x1024.png') });

    // 15: Viewport Mobile 390x844 (Queue)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.click('button:has-text("Queue (FIFO)")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotDir, '15_viewport_mobile_390x844.png') });

    console.log('Shiki visual audit completed successfully.');
    console.log('Console error count:', consoleErrors.length);
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
