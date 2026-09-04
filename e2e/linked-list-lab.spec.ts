import { test, expect } from '@playwright/test';

test.describe('Linked List Laboratory (Pointer Chains & Dynamic Nodes)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Switch to Linked List Laboratory' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Singly Linked List');
  });

  test('visualizes pointer chains, HEAD, TAIL, and sequential traversal', async ({ page }) => {
    const inspector = page.locator('.lab-inspector-section');
    await expect(inspector).toContainText('4 nodes');
    await expect(page.locator('.viz-pointer-label-text:has-text("HEAD")')).toBeVisible();
    await expect(page.locator('.viz-pointer-label-text:has-text("TAIL")')).toBeVisible();

    const stepForwardBtn = page.getByRole('button', { name: 'Step forward' });
    await stepForwardBtn.click();

    await expect(inspector).toContainText('Action: PREPEND');
    await expect(inspector).toContainText('5 nodes');

    const searchPresetBtn = page.getByRole('button', { name: /Search & Traverse/ });
    if (await searchPresetBtn.isVisible()) {
      await searchPresetBtn.click();
      await expect(inspector).toContainText('Step Index: 1 / 5');
      await stepForwardBtn.click();
      await expect(inspector).toContainText('SEARCH');
    }
  });

  test('performs interactive prepend operation updating node list and SVG edges', async ({ page }) => {
    const input = page.locator('.lab-controls-section').getByRole('textbox').first();
    const prependBtn = page.getByRole('button', { name: 'Prepend node at head' });
    const inspector = page.locator('.lab-inspector-section');

    await input.fill('99');
    await prependBtn.click();

    await expect(inspector).toContainText('HEAD Node: 99');
    await expect(page.locator('.viz-node-label:has-text("99")')).toBeVisible();
  });
});
