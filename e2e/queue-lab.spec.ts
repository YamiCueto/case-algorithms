import { test, expect } from '@playwright/test';

test.describe('Queue Laboratory (FIFO Principle & Circular Buffer)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Switch to Queue Laboratory' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Queue & FIFO');
  });

  test('performs FIFO operations with independent FRONT and REAR pointers', async ({ page }) => {
    const inspector = page.locator('.lab-inspector-section');
    await expect(inspector).toContainText('Items in Queue: 0 / 6');

    const stepForwardBtn = page.getByRole('button', { name: 'Step forward' });
    await stepForwardBtn.click();

    await expect(inspector).toContainText('Items in Queue: 1 / 6');
    await expect(inspector).toContainText('Action: ENQUEUE');
    await expect(page.locator('.viz-pointer-label-text:has-text("FRONT")')).toBeVisible();
    await expect(page.locator('.viz-pointer-label-text:has-text("REAR")')).toBeVisible();

    await stepForwardBtn.click();
    await expect(inspector).toContainText('Items in Queue: 2 / 6');

    await stepForwardBtn.click();
    await expect(inspector).toContainText('Items in Queue: 3 / 6');

    await stepForwardBtn.click();
    await expect(inspector).toContainText('Action: DEQUEUE');
    await expect(inspector).toContainText('Items in Queue: 2 / 6');
  });

  test('executes interactive enqueue and buffer clear', async ({ page }) => {
    const input = page.locator('.lab-controls-section').getByRole('textbox');
    const enqueueBtn = page.getByRole('button', { name: 'Enqueue value into queue' });
    const clearBtn = page.getByRole('button', { name: 'Clear queue' });
    const inspector = page.locator('.lab-inspector-section');

    await input.fill('77');
    await enqueueBtn.click();
    await expect(inspector).toContainText('77');

    await clearBtn.click();
    await expect(inspector).toContainText('Items in Queue: 0 / 6');
  });
});
