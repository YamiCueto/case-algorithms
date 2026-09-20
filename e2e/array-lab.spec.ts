import { test, expect } from '@playwright/test';

test.describe('Array Laboratory & Bubble Sort Exploration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Cambiar al laboratorio de arreglos' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Exploración de Arreglos y Ordenamiento Burbuja');
  });

  test('executes step-by-step sorting with synchronized code highlighting and visual state in Spanish', async ({ page }) => {
    const stepForwardBtn = page.getByRole('button', { name: 'Avanzar un paso' });
    const stepBackwardBtn = page.getByRole('button', { name: 'Retroceder un paso' });
    const resetBtn = page.getByRole('button', { name: 'Reiniciar al paso inicial' });
    const inspector = page.locator('.lab-inspector-section');

    await expect(inspector).toContainText('1 / 19');
    await expect(page.locator('.viz-node')).toHaveCount(5);

    await stepForwardBtn.click();
    await expect(inspector).toContainText('2 / 19');
    await expect(inspector).toContainText('COMPARE');
    await expect(page.locator('.code-viewer-active-badge')).toHaveText('Line 6 Active');
    await expect(page.locator('.viz-node-comparing')).toHaveCount(2);

    await stepForwardBtn.click();
    await expect(inspector).toContainText('3 / 19');
    await expect(inspector).toContainText('SWAP');
    await expect(page.locator('.code-viewer-active-badge')).toHaveText('Line 7 Active');
    await expect(page.locator('.viz-node-swapping')).toHaveCount(2);

    await stepBackwardBtn.click();
    await expect(inspector).toContainText('2 / 19');
    await expect(inspector).toContainText('COMPARE');
    await expect(page.locator('.code-viewer-active-badge')).toHaveText('Line 6 Active');

    await resetBtn.click();
    await expect(inspector).toContainText('1 / 19');
    await expect(page.locator('.viz-node-comparing')).toHaveCount(0);
  });

  test('controls playback timer and switches to English verifying localized controls', async ({ page }) => {
    const playBtnEs = page.getByRole('button', { name: 'Reproducir ejecución automática' });
    await expect(playBtnEs).toBeVisible();

    await playBtnEs.click();
    const pauseBtnEs = page.getByRole('button', { name: 'Pausar ejecución' });
    await expect(pauseBtnEs).toBeVisible();

    const inspector = page.locator('.lab-inspector-section');
    await expect(inspector).toContainText(/Índice de paso: [1-9]/);

    await pauseBtnEs.click();
    await expect(page.getByRole('button', { name: 'Reproducir ejecución automática' })).toBeVisible();

    const enRadio = page.getByRole('radio', { name: 'Switch to English' });
    await enRadio.click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Array & Bubble Sort Exploration');
    await expect(page.locator('.lab-inspector-section')).toContainText('State & Metrics Inspector');

    const playBtnEn = page.getByRole('button', { name: 'Play auto execution' });
    await expect(playBtnEn).toBeVisible();

    const tsBtn = page.locator('.code-stage-panel').getByRole('button', { name: 'TypeScript' });
    await tsBtn.click();
    await expect(page.locator('.code-viewer-lang-badge')).toHaveText('TypeScript');
    await expect(page.locator('.shiki-token-keyword').first()).toBeVisible();
  });
});
