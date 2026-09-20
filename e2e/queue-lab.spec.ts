import { test, expect } from '@playwright/test';

test.describe('Queue Laboratory (FIFO Principle & Circular Buffer)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Cambiar al laboratorio de colas' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Exploración de Colas y Principio FIFO');
  });

  test('performs FIFO operations with independent FRONT and REAR pointers in Spanish', async ({ page }) => {
    const inspector = page.locator('.lab-inspector-section');
    await expect(inspector).toContainText('Elementos en la cola: 0 / 6');

    const stepForwardBtn = page.getByRole('button', { name: 'Avanzar un paso' });
    await stepForwardBtn.click();

    await expect(inspector).toContainText('Elementos en la cola: 1 / 6');
    await expect(inspector).toContainText('ENQUEUE');
    await expect(page.locator('.viz-pointer-label-text:has-text("FRONT")')).toBeVisible();
    await expect(page.locator('.viz-pointer-label-text:has-text("REAR")')).toBeVisible();

    await stepForwardBtn.click();
    await expect(inspector).toContainText('Elementos en la cola: 2 / 6');

    await stepForwardBtn.click();
    await expect(inspector).toContainText('Elementos en la cola: 3 / 6');

    await stepForwardBtn.click();
    await expect(inspector).toContainText('DEQUEUE');
    await expect(inspector).toContainText('Elementos en la cola: 2 / 6');
  });

  test('executes interactive operations in Spanish and validates English translation', async ({ page }) => {
    const input = page.locator('.lab-controls-section').getByRole('textbox');
    const enqueueBtn = page.getByRole('button', { name: 'Encolar valor en la cola' });
    const clearBtn = page.getByRole('button', { name: 'Vaciar cola' });
    const inspector = page.locator('.lab-inspector-section');

    await input.fill('77');
    await enqueueBtn.click();
    await expect(inspector).toContainText('77');

    await clearBtn.click();
    await expect(inspector).toContainText('Elementos en la cola: 0 / 6');

    const enRadio = page.getByRole('radio', { name: 'Switch to English' });
    await enRadio.click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Queue & FIFO Principle Exploration');
    await expect(page.locator('.lab-inspector-section')).toContainText('Items in Queue: 0 / 6');
    await expect(page.getByRole('button', { name: 'Enqueue value into queue' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Clear queue' })).toBeVisible();
  });
});
