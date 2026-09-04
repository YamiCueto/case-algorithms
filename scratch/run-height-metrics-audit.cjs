const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');

const distDir = path.resolve(__dirname, '../dist');
const screenshotDir = path.resolve(
  'C:/Users/YAMI/.gemini/antigravity-ide/brain/6505d361-5113-464e-b8d9-f5ffe41a0ad5/scratch/height_audit_screenshots'
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

const PORT = 4180;

server.listen(PORT, async () => {
  console.log(`Server listening on http://localhost:${PORT}/case-algorithms/`);
  const browser = await chromium.launch({ headless: true });

  try {
    const viewports = [
      { name: 'desktop_1440x900', width: 1440, height: 900 },
      { name: 'laptop_1280x720', width: 1280, height: 720 },
      { name: 'tablet_768x1024', width: 768, height: 1024 },
      { name: 'mobile_390x844', width: 390, height: 844 },
    ];

    for (const vp of viewports) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await context.newPage();

      await page.goto(`http://localhost:${PORT}/case-algorithms/`);
      await page.waitForSelector('.lab-shell');
      await page.waitForTimeout(300);

      // Measure layout metrics
      const metrics = await page.evaluate(() => {
        const stage = document.querySelector('.lab-stage-grid')?.getBoundingClientRect();
        const timeTravel = document.querySelector('.time-travel-panel')?.getBoundingClientRect();
        const header = document.querySelector('.lab-topic-header')?.getBoundingClientRect();
        const codeBox = document.querySelector('.code-viewer-scroll-box')?.getBoundingClientRect();
        const visibleLines = document.querySelectorAll('.code-line-row').length;

        return {
          windowHeight: window.innerHeight,
          headerBottom: header?.bottom,
          stageTop: stage?.top,
          stageHeight: stage?.height,
          stageBottom: stage?.bottom,
          timeTravelTop: timeTravel?.top,
          timeTravelBottom: timeTravel?.bottom,
          codeBoxHeight: codeBox?.height,
          visibleLines,
          timeTravelVisibleAboveFold: timeTravel ? timeTravel.bottom <= window.innerHeight : false,
        };
      });

      console.log(`\n=== Metrics for ${vp.name} ===`);
      console.log(JSON.stringify(metrics, null, 2));

      // Capture default Array lab in Dark
      await page.screenshot({ path: path.join(screenshotDir, `${vp.name}_array_default.png`) });

      // Step forward to Step 1 (COMPARE)
      await page.click('button:has-text("Step >")');
      await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(screenshotDir, `${vp.name}_array_step1_compare.png`) });

      // Step forward to Step 2 (SWAP)
      await page.click('button:has-text("Step >")');
      await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(screenshotDir, `${vp.name}_array_step2_swap.png`) });

      // Test Stack Lab
      await page.click('button:has-text("Stack (LIFO)")');
      await page.waitForTimeout(200);
      await page.click('button:has-text("Step >")'); // Push 10
      await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(screenshotDir, `${vp.name}_stack_push.png`) });

      // Test Queue Lab
      await page.click('button:has-text("Queue (FIFO)")');
      await page.waitForTimeout(200);
      await page.click('button:has-text("Step >")'); // Enqueue 10
      await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(screenshotDir, `${vp.name}_queue_enqueue.png`) });

      // Test Linked List Lab
      await page.click('button:has-text("Linked List")');
      await page.waitForTimeout(200);
      await page.click('button:has-text("Step >")'); // Prepend 10
      await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(screenshotDir, `${vp.name}_linkedlist_prepend.png`) });

      await context.close();
    }

    console.log('\nAll height metrics and screenshots captured successfully.');
  } catch (err) {
    console.error('Audit failed:', err);
  } finally {
    await browser.close();
    server.close();
  }
});
