import { test, expect } from '@playwright/test';

test.describe('Linked List Laboratory (Pointer Chains & Dynamic Nodes)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Cambiar al laboratorio de listas enlazadas' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lista simplemente enlazada y cadenas de punteros');
  });

  test('visualizes pointer chains, HEAD, TAIL, and sequential traversal in Spanish', async ({ page }) => {
    const inspector = page.locator('.lab-inspector-section');
    await expect(inspector).toContainText('4 nodos');
    await expect(page.locator('.viz-pointer-label-text:has-text("HEAD")')).toBeVisible();
    await expect(page.locator('.viz-pointer-label-text:has-text("TAIL")')).toBeVisible();

    const stepForwardBtn = page.getByRole('button', { name: 'Avanzar un paso' });
    await stepForwardBtn.click();

    await expect(inspector).toContainText('PREPEND');
    await expect(inspector).toContainText('5 nodos');

    const searchPresetBtn = page.getByRole('button', { name: /Búsqueda y recorrido/ });
    if (await searchPresetBtn.isVisible()) {
      await searchPresetBtn.click();
      await expect(inspector).toContainText('1 / 5');
      await stepForwardBtn.click();
      await expect(inspector).toContainText('SEARCH');
    }
  });

  test('performs interactive prepend operation in Spanish and switches to English', async ({ page }) => {
    const input = page.locator('.lab-controls-section').getByRole('textbox').first();
    const prependBtn = page.getByRole('button', { name: 'Insertar nodo en la cabeza' });
    const inspector = page.locator('.lab-inspector-section');

    await input.fill('99');
    await prependBtn.click();

    await expect(inspector).toContainText('Nodo HEAD: 99');
    await expect(page.locator('.viz-node-label:has-text("99")')).toBeVisible();

    const enRadio = page.getByRole('radio', { name: 'Switch to English' });
    await enRadio.click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Singly Linked List & Pointer Chains');
    await expect(page.locator('.lab-inspector-section')).toContainText('HEAD Node: 99');
    await expect(page.getByRole('button', { name: 'Prepend node at head' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Clear linked list' })).toBeVisible();
  });
});
