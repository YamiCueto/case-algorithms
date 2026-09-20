import { test, expect } from '@playwright/test';

test.describe('Stack Laboratory (LIFO Principle)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: /(Switch to Stack Laboratory|Cambiar al laboratorio de pilas)/i }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Stack & LIFO');
  });

  test('performs Push, Pop, and Peek operations with synchronized visual top pointer', async ({ page }) => {
    const inspector = page.locator('.lab-inspector-section');
    await expect(inspector).toContainText('Items in Stack: 0 / 6');

    const stepForwardBtn = page.getByRole('button', { name: /(Step forward|Avanzar un paso)/i });
    await stepForwardBtn.click();

    await expect(inspector).toContainText('Items in Stack: 1 / 6');
    await expect(inspector).toContainText('Action: PUSH');
    await expect(page.locator('.viz-pointer')).toBeVisible();
    await expect(page.locator('.viz-pointer-label-text')).toContainText('TOP');

    await stepForwardBtn.click();
    await expect(inspector).toContainText('Items in Stack: 2 / 6');

    await stepForwardBtn.click();
    await expect(inspector).toContainText('Items in Stack: 3 / 6');

    await stepForwardBtn.click();
    await expect(inspector).toContainText('Action: POP');
    await expect(inspector).toContainText('Items in Stack: 2 / 6');
  });

  test('executes interactive push and clear operations', async ({ page }) => {
    const input = page.locator('.lab-controls-section').getByRole('textbox');
    const pushBtn = page.getByRole('button', { name: 'Push value onto stack' });
    const clearBtn = page.getByRole('button', { name: 'Clear stack' });
    const inspector = page.locator('.lab-inspector-section');

    await input.fill('99');
    await pushBtn.click();
    await expect(inspector).toContainText('99');

    await clearBtn.click();
    await expect(inspector).toContainText('Items in Stack: 0 / 6');
  });

  test('animates POP with transient ghost node and settles without residual transforms', async ({ page }) => {
    const stepForwardBtn = page.getByRole('button', { name: /(Step forward|Avanzar un paso)/i });

    await stepForwardBtn.click();
    await stepForwardBtn.click();
    await stepForwardBtn.click();

    await stepForwardBtn.click();

    await expect(page.locator('.stack-ghost-anchor')).toHaveCount(0);
    await expect(page.locator('.stack-slot-group')).toHaveCount(2);

    const slotMotions = page.locator('.stack-slot-motion');
    const count = await slotMotions.count();
    for (let i = 0; i < count; i++) {
      const transform = await slotMotions.nth(i).getAttribute('style');
      expect(transform || '').not.toContain('translateY');
    }
  });

  test('animates interactive PUSH and cleans up temporary transforms upon completion', async ({ page }) => {
    const input = page.locator('.lab-controls-section').getByRole('textbox');
    const pushBtn = page.getByRole('button', { name: 'Push value onto stack' });

    await input.fill('77');
    await pushBtn.click();

    const node77 = page.locator('.viz-node:has-text("77")');
    await expect(node77).toBeVisible();

    await page.waitForTimeout(600);

    const topMotion = page.locator('.stack-slot-group').last().locator('.stack-slot-motion');
    const style = await topMotion.getAttribute('style');
    expect(style || '').not.toContain('translateY');
  });
});

