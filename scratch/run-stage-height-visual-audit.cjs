const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');

const distDir = path.resolve(__dirname, '../dist');
const screenshotDir = path.resolve(
  'C:/Users/YAMI/.gemini/antigravity-ide/brain/6505d361-5113-464e-b8d9-f5ffe41a0ad5/scratch/stage_height_screenshots'
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

const PORT = 4179;

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

    // 01: Array COMPARE (1440x900 Desktop Dark)
    await page.click('button:has-text("Array & Bubble Sort")');
    await page.waitForTimeout(200);
    await page.click('button:has-text("Step >")'); // Step 1: compare
    await page.waitForTimeout(200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(screenshotDir, '01_array_compare_1440x900.png') });

    // 02: Array SWAP (1440x900 Desktop Dark)
    await page.click('button:has-text("Step >")'); // Step 2: swap
    await page.waitForTimeout(200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(screenshotDir, '02_array_swap_1440x900.png') });

    // 03: Array SWAP Light Theme (1440x900 Desktop Light)
    await page.click('.theme-toggle-btn');
    await page.waitForTimeout(300);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(screenshotDir, '03_array_swap_light_1440x900.png') });
    await page.click('.theme-toggle-btn');
    await page.waitForTimeout(300);

    // 04: Stack PUSH (1440x900 Desktop Dark)
    await page.click('button:has-text("Stack (LIFO)")');
    await page.waitForTimeout(300);
    await page.click('.code-stage-panel button:has-text("TypeScript")');
    await page.waitForTimeout(200);
    await page.click('button:has-text("Step >")'); // Push 10
    await page.waitForTimeout(200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(screenshotDir, '04_stack_push_1440x900.png') });

    // 05: Stack POP (1440x900 Desktop Dark)
    await page.click('button:has-text("Step >")'); // Push 20
    await page.waitForTimeout(100);
    await page.click('button:has-text("Step >")'); // Push 30
    await page.waitForTimeout(100);
    await page.click('button:has-text("Step >")'); // Pop 30
    await page.waitForTimeout(200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(screenshotDir, '05_stack_pop_1440x900.png') });

    // 06: Queue ENQUEUE (1440x900 Desktop Dark)
    await page.click('button:has-text("Queue (FIFO)")');
    await page.waitForTimeout(300);
    await page.click('.code-stage-panel button:has-text("TypeScript")');
    await page.waitForTimeout(200);
    await page.click('button:has-text("Step >")'); // Enqueue 10
    await page.waitForTimeout(200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(screenshotDir, '06_queue_enqueue_1440x900.png') });

    // 07: Queue DEQUEUE (1440x900 Desktop Dark)
    await page.click('button:has-text("Step >")'); // Enqueue 20
    await page.waitForTimeout(100);
    await page.click('button:has-text("Step >")'); // Enqueue 30
    await page.waitForTimeout(100);
    await page.click('button:has-text("Step >")'); // Dequeue 10
    await page.waitForTimeout(200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(screenshotDir, '07_queue_dequeue_1440x900.png') });

    // 08: Linked List INSERT (1440x900 Desktop Dark)
    await page.click('button:has-text("Linked List")');
    await page.waitForTimeout(300);
    await page.click('.code-stage-panel button:has-text("TypeScript")');
    await page.waitForTimeout(200);
    await page.click('button:has-text("Step >")'); // Prepend 10
    await page.waitForTimeout(200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(screenshotDir, '08_linked_list_insert_1440x900.png') });

    // 09: Linked List FIND (1440x900 Desktop Dark)
    await page.click('button:has-text("Search & Traverse")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Step >")'); // Visit
    await page.waitForTimeout(200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(screenshotDir, '09_linked_list_find_1440x900.png') });

    // 10: Viewport Laptop 1280x720 (Array TS)
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.click('button:has-text("Array & Bubble Sort")');
    await page.waitForTimeout(300);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(screenshotDir, '10_laptop_1280x720_array.png') });

    // 11: Viewport Tablet 768x1024 (Stack TS)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.click('button:has-text("Stack (LIFO)")');
    await page.waitForTimeout(300);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(screenshotDir, '11_tablet_768x1024_stack.png') });

    // 12: Viewport Mobile 390x844 (Queue TS)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.click('button:has-text("Queue (FIFO)")');
    await page.waitForTimeout(300);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(screenshotDir, '12_mobile_390x844_queue.png') });

    console.log('Stage height visual audit completed. Errors:', consoleErrors.length);
  } catch (err) {
    console.error('Audit error:', err);
  } finally {
    await browser.close();
    server.close();
  }
});
