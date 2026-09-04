import { test, expect } from '@playwright/test';

test.describe('Array Laboratory & Bubble Sort Exploration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Switch to Array Laboratory' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Array & Bubble Sort');
  });

  test('executes step-by-step sorting with synchronized code highlighting and visual state', async ({ page }) => {
    const stepForwardBtn = page.getByRole('button', { name: 'Step forward' });
    const stepBackwardBtn = page.getByRole('button', { name: 'Step backward' });
    const resetBtn = page.getByRole('button', { name: 'Reset to initial step' });
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

  test('controls playback timer and toggles between Pseudocode and TypeScript', async ({ page }) => {
    const playBtn = page.getByRole('button', { name: 'Play auto execution' });
    await expect(playBtn).toBeVisible();

    await playBtn.click();
    const pauseBtn = page.getByRole('button', { name: 'Pause execution' });
    await expect(pauseBtn).toBeVisible();

    const inspector = page.locator('.lab-inspector-section');
    await expect(inspector).toContainText(/Step Index: [1-9]/);

    await pauseBtn.click();
    await expect(page.getByRole('button', { name: 'Play auto execution' })).toBeVisible();

    const tsBtn = page.locator('.code-stage-panel').getByRole('button', { name: 'TypeScript' });
    await tsBtn.click();
    await expect(page.locator('.code-viewer-lang-badge')).toHaveText('TypeScript');
    await expect(page.locator('.shiki-token-keyword').first()).toBeVisible();
  });
});
