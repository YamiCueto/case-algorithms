import { test, expect } from '@playwright/test';

test.describe('Stack Laboratory (LIFO Principle)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Cambiar al laboratorio de pilas' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Exploración de Pilas y Principio LIFO');
  });

  test('performs Push, Pop, and Peek operations with synchronized visual top pointer in Spanish and English', async ({ page }) => {
    const inspector = page.locator('.lab-inspector-section');
    await expect(inspector).toContainText('Elementos en la pila: 0 / 6');

    const stepForwardBtn = page.getByRole('button', { name: 'Avanzar un paso' });
    await stepForwardBtn.click();

    await expect(inspector).toContainText('Elementos en la pila: 1 / 6');
    await expect(inspector).toContainText('PUSH');
    await expect(page.locator('.viz-pointer')).toBeVisible();
    await expect(page.locator('.viz-pointer-label-text')).toContainText('TOP');

    await stepForwardBtn.click();
    await expect(inspector).toContainText('Elementos en la pila: 2 / 6');

    await stepForwardBtn.click();
    await expect(inspector).toContainText('Elementos en la pila: 3 / 6');

    await stepForwardBtn.click();
    await expect(inspector).toContainText('POP');
    await expect(inspector).toContainText('Elementos en la pila: 2 / 6');

    const enRadio = page.getByRole('radio', { name: 'Switch to English' });
    await enRadio.click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Stack & LIFO Principle Exploration');
    await expect(inspector).toContainText('Items in Stack: 2 / 6');
    await expect(page.getByRole('button', { name: 'Push value onto stack' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pop top value from stack' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Peek top value' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Clear stack' })).toBeVisible();
  });

  test('executes interactive push and clear operations', async ({ page }) => {
    const input = page.locator('.lab-controls-section').getByRole('textbox');
    const pushBtn = page.getByRole('button', { name: 'Apilar valor en la pila' });
    const clearBtn = page.getByRole('button', { name: 'Vaciar pila' });
    const inspector = page.locator('.lab-inspector-section');

    await input.fill('99');
    await pushBtn.click();
    await expect(inspector).toContainText('99');

    await clearBtn.click();
    await expect(inspector).toContainText('Elementos en la pila: 0 / 6');
  });

  test('animates POP with transient ghost node and settles without residual transforms', async ({ page }) => {
    const stepForwardBtn = page.getByRole('button', { name: 'Avanzar un paso' });

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
    const pushBtn = page.getByRole('button', { name: 'Apilar valor en la pila' });

    await input.fill('77');
    await pushBtn.click();

    const node77 = page.locator('.viz-node:has-text("77")');
    await expect(node77).toBeVisible();

    const topMotion = page.locator('.stack-slot-group').last().locator('.stack-slot-motion');
    await expect(topMotion).toBeVisible();

    await expect.poll(async () => {
      const style = await topMotion.getAttribute('style');
      return style || '';
    }).not.toContain('translateY');
  });

  test('preserves timeline and completes motion when language is toggled during active PUSH animation', async ({ page }) => {
    const stepForwardBtn = page.getByRole('button', { name: 'Avanzar un paso' });
    await stepForwardBtn.click();

    const motionSlot = page.locator('.stack-slot-motion[data-slot-index="0"]');
    await expect(motionSlot).toBeVisible();

    const enRadio = page.getByRole('radio', { name: 'Switch to English' });
    await enRadio.click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Stack & LIFO Principle Exploration');
    await expect(page.locator('.viz-node:has-text("10")')).toBeVisible();
    await expect(page.locator('.stack-slot-group')).toHaveCount(1);

    await expect.poll(async () => {
      const style = await motionSlot.getAttribute('style');
      return style || '';
    }).not.toContain('translateY');

    const inspector = page.locator('.lab-inspector-section');
    await expect(inspector).toContainText('Items in Stack: 1 / 6');
    await expect(page.locator('.inspector-val-index').first()).toHaveText('2 / 7');
    await expect(page.locator('.stack-ghost-anchor')).toHaveCount(0);
  });

  test('preserves timeline and cleanly unmounts transient ghost node when language is toggled during active POP animation', async ({ page }) => {
    const stepForwardBtn = page.getByRole('button', { name: 'Avanzar un paso' });

    await stepForwardBtn.click();
    await stepForwardBtn.click();
    await stepForwardBtn.click();
    await expect(page.locator('.lab-inspector-section')).toContainText('Elementos en la pila: 3 / 6');

    await stepForwardBtn.click();
    const ghostAnchor = page.locator('.stack-ghost-anchor');
    await expect(ghostAnchor).toBeVisible();

    const enRadio = page.getByRole('radio', { name: 'Switch to English' });
    await enRadio.click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Stack & LIFO Principle Exploration');
    await expect(page.locator('.stack-ghost-anchor')).toHaveCount(0);
    await expect(page.locator('.stack-slot-group')).toHaveCount(2);

    const inspector = page.locator('.lab-inspector-section');
    await expect(inspector).toContainText('Items in Stack: 2 / 6');
    await expect(page.locator('.inspector-val-index').first()).toHaveText('5 / 7');

    const slotMotions = page.locator('.stack-slot-motion');
    const count = await slotMotions.count();
    for (let i = 0; i < count; i++) {
      const transform = await slotMotions.nth(i).getAttribute('style');
      expect(transform || '').not.toContain('translateY');
    }
  });

  test('does not modify current step or restart playback timer when language changes during auto-play', async ({ page }) => {
    const playBtn = page.getByRole('button', { name: 'Reproducir ejecución automática' });
    await playBtn.click();

    await expect(page.getByRole('button', { name: 'Pausar ejecución' })).toBeVisible();
    await expect(page.locator('.inspector-val-index').first()).not.toHaveText('1 / 7');

    const enRadio = page.getByRole('radio', { name: 'Switch to English' });
    await enRadio.click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Stack & LIFO Principle Exploration');

    const pauseBtnEn = page.getByRole('button', { name: 'Pause execution' });
    await expect(pauseBtnEn).toBeVisible();

    const stepAfter = await page.locator('.inspector-val-index').first().textContent();
    expect(stepAfter).not.toBe('1 / 7');
    expect(stepAfter).not.toBe('0 / 7');

    await pauseBtnEn.click();
    await expect(page.getByRole('button', { name: 'Play auto execution' })).toBeVisible();
  });

  test('playground contract: push into empty stack creates single element without preset residual', async ({ page }) => {
    const input = page.locator('.lab-controls-section').getByRole('textbox');
    const pushBtn = page.getByRole('button', { name: 'Apilar valor en la pila' });
    const inspector = page.locator('.lab-inspector-section');

    await expect(inspector).toContainText('Elementos en la pila: 0 / 6');
    await input.fill('77');
    await pushBtn.click();

    await expect(inspector).toContainText('Elementos en la pila: 1 / 6');
    await expect(inspector).toContainText('77');
    await expect(inspector).toContainText('2 / 3');
    await expect(page.locator('.viz-node:has-text("77")')).toHaveCount(1);
    await expect(page.locator('.viz-node')).toHaveCount(1);
  });

  test('playground contract: pop from intermediate step pops visible top without future preset commands', async ({ page }) => {
    const stepForwardBtn = page.getByRole('button', { name: 'Avanzar un paso' });
    const popBtn = page.getByRole('button', { name: 'Desapilar valor del tope de la pila' });
    const inspector = page.locator('.lab-inspector-section');

    await stepForwardBtn.click();
    await stepForwardBtn.click();

    await expect(inspector).toContainText('Elementos en la pila: 2 / 6');
    await expect(inspector).toContainText('20');

    await popBtn.click();

    await expect(inspector).toContainText('Elementos en la pila: 1 / 6');
    await expect(inspector).toContainText('10');
    await expect(inspector).toContainText('4 / 5');
    await expect(page.locator('.viz-node')).toHaveCount(1);

    const stepBackwardBtn = page.getByRole('button', { name: 'Retroceder un paso' });
    await stepBackwardBtn.click();
    await expect(inspector).toContainText('Elementos en la pila: 2 / 6');
  });
});
