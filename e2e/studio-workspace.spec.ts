import { test, expect } from '@playwright/test';

const laboratories = [
  'Cambiar al laboratorio de arreglos',
  'Cambiar al laboratorio de pilas',
  'Cambiar al laboratorio de colas',
  'Cambiar al laboratorio de listas enlazadas',
];

for (const width of [360, 390, 768, 1440]) {
  test(`workspace panels remain inside the viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    for (const name of laboratories) {
      await page.getByRole('button', { name, exact: true }).click();
      for (const selector of ['.visualization-stage-panel', '.code-stage-panel', '.lab-controls-section', '.lab-inspector-section', '.lab-knowledge-section']) {
        const box = await page.locator(selector).boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
  });
}

test('focus and language changes preserve the visible timeline and code state', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Avanzar un paso', exact: true }).click();
  const before = await page.locator('.time-travel-scrubber').inputValue();
  const nodeValues = await page.locator('.viz-node-label').allTextContents();
  const focus = page.getByRole('button', { name: 'Concentración', exact: true });
  await focus.focus();
  await page.keyboard.press('Space');
  await expect(page.locator('.code-stage-panel')).toBeHidden();
  await expect(page.locator('.time-travel-scrubber')).toHaveValue(before);
  await page.getByRole('radio', { name: 'Switch to English', exact: true }).click();
  await page.getByRole('button', { name: 'Full workspace', exact: true }).click();
  await expect(page.locator('.code-stage-panel')).toBeVisible();
  await expect(page.locator('.time-travel-scrubber')).toHaveValue(before);
  expect(await page.locator('.viz-node-label').allTextContents()).toEqual(nodeValues);
  await expect(page.getByRole('button', { name: 'Play auto execution', exact: true })).toBeVisible();
});

test('learning tabs support keyboard navigation without seeking the algorithm', async ({ page }) => {
  await page.goto('./');
  const tabs = page.getByRole('tablist');
  await tabs.getByRole('tab').first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.getByRole('tab').nth(1)).toBeFocused();
  await expect(tabs.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.time-travel-scrubber')).toHaveValue('0');
  await page.keyboard.press('End');
  await expect(tabs.getByRole('tab').last()).toBeFocused();
  await expect(page.locator('.time-travel-scrubber')).toHaveValue('0');
});

test('eight-node list keeps NULL inside viewBox and zoom remains local to the canvas', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await page.getByRole('button', { name: 'Ir al último paso', exact: true }).click();
  const svg = page.locator('svg.svg-viewport');
  const bounds = await svg.evaluate((element) => {
    const view = (element as SVGSVGElement).viewBox.baseVal;
    return [...element.querySelectorAll('.ll-stage-container rect')].map(rect => {
      const box = (rect as SVGGraphicsElement).getBBox();
      return { left: box.x, right: box.x + box.width, width: view.width };
    });
  });
  expect(bounds.length).toBeGreaterThanOrEqual(9);
  for (const box of bounds) {
    expect(box.left).toBeGreaterThanOrEqual(0);
    expect(box.right).toBeLessThanOrEqual(box.width);
  }
  const step = await page.locator('.time-travel-scrubber').inputValue();
  await page.getByRole('button', { name: 'Ampliar visualización', exact: true }).click();
  const canvas = page.getByRole('region', { name: 'Lienzo ampliado, desplázate para explorar' });
  await expect(canvas).toBeVisible();
  expect(await canvas.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
  await canvas.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('.time-travel-scrubber')).toHaveValue(step);
  await page.getByRole('button', { name: 'Ajustar al lienzo', exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
