import { test, expect } from '@playwright/test';

test.describe('Visual Layout & Rendering Integrity', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('validates visual geometry and elements of Array Laboratory stage', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Switch to Array Laboratory' }).click();

    const stage = page.locator('.visualization-stage-panel');
    await expect(stage).toBeVisible();

    const box = await stage.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(600);
    expect(box!.height).toBeGreaterThanOrEqual(300);

    const nodes = page.locator('.viz-node');
    await expect(nodes).toHaveCount(5);
    for (let i = 0; i < 5; i++) {
      await expect(nodes.nth(i)).toBeVisible();
    }
  });

  test('validates visual geometry and elements of Stack Laboratory stage', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Switch to Stack Laboratory' }).click();

    const stage = page.locator('.visualization-stage-panel');
    await expect(stage).toBeVisible();

    const box = await stage.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(600);
    expect(box!.height).toBeGreaterThanOrEqual(300);

    const svg = stage.locator('svg');
    await expect(svg).toBeVisible();
  });

  test('validates visual geometry and elements of Queue Laboratory stage', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Switch to Queue Laboratory' }).click();

    const stage = page.locator('.visualization-stage-panel');
    await expect(stage).toBeVisible();

    const box = await stage.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(600);
    expect(box!.height).toBeGreaterThanOrEqual(300);

    const svg = stage.locator('svg');
    await expect(svg).toBeVisible();
  });

  test('validates visual geometry and elements of Linked List Laboratory stage', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Switch to Linked List Laboratory' }).click();

    const stage = page.locator('.visualization-stage-panel');
    await expect(stage).toBeVisible();

    const box = await stage.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(600);
    expect(box!.height).toBeGreaterThanOrEqual(300);

    await expect(page.locator('.viz-pointer-label-text:has-text("HEAD")')).toBeVisible();
    await expect(page.locator('.viz-pointer-label-text:has-text("TAIL")')).toBeVisible();
  });

  test('validates visual geometry and tokens of CodeViewer component', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Switch to Array Laboratory' }).click();

    const codePanel = page.locator('.code-stage-panel');
    await expect(codePanel).toBeVisible();

    const box = await codePanel.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(400);
    expect(box!.height).toBeGreaterThanOrEqual(300);

    await expect(page.locator('.code-viewer-container')).toBeVisible();
    await expect(page.locator('.code-viewer-lang-badge')).toHaveText('Pseudocode');
    await expect(page.locator('.code-line-number').first()).toBeVisible();
    await expect(page.locator('.shiki-token-keyword').first()).toBeVisible();

    await page.getByRole('button', { name: 'Step forward' }).click();
    await expect(page.locator('.code-viewer-active-badge')).toHaveText('Line 6 Active');
    await expect(page.locator('.code-line-active')).toBeVisible();
  });
});
