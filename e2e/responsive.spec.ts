import { test, expect } from '@playwright/test';

test.describe('Responsive Layout & Viewport Ergonomics', () => {
  const viewports = [
    { name: 'Desktop', width: 1440, height: 900, dualStageCols: 2 },
    { name: 'Laptop', width: 1280, height: 720, dualStageCols: 2 },
    { name: 'Tablet', width: 768, height: 1024, dualStageCols: 1 },
    { name: 'Mobile', width: 390, height: 844, dualStageCols: 1 },
  ];

  for (const vp of viewports) {
    test(`renders robustly on ${vp.name} (${vp.width}x${vp.height}) with zero horizontal overflow`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('./');

      await expect(page.locator('.lab-shell')).toBeVisible();
      await expect(page.locator('.visualization-stage-panel')).toBeVisible();
      await expect(page.locator('.code-stage-panel')).toBeVisible();
      await expect(page.locator('.time-travel-panel')).toBeVisible();

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScroll).toBe(false);

      if (vp.dualStageCols === 2) {
        const gridColumns = await page.locator('.lab-stage-grid').evaluate((el) => {
          return window.getComputedStyle(el).gridTemplateColumns.split(' ').length;
        });
        expect(gridColumns).toBe(2);
      }
    });
  }
});
