import { test, expect, Locator } from '@playwright/test';

async function seekTo(scrubber: Locator, targetIndex: number) {
  await scrubber.evaluate((el: HTMLInputElement, val: string) => {
    const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    if (set) {
      set.call(el, val);
    } else {
      el.value = val;
    }
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, String(targetIndex));
}

test.describe('Hito 2 Fase 2: Timeline Scrubber across all laboratories', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('Array Lab: scrubber present in dock, seeking updates step, viz, and CodeViewer, and stops playback', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('./');
    await page.getByRole('button', { name: /(Switch to Array Laboratory|Cambiar al laboratorio de arreglos)/i }).click();

    const scrubber = page.locator('.visualization-stage-panel .stage-playback-dock .time-travel-scrubber');
    const progressLabel = page.locator('.visualization-stage-panel .stage-playback-dock .scrubber-progress-label');
    const playBtn = page.getByRole('button', { name: /(Reproducir ejecución automática|Play auto execution)/i });
    const pauseBtn = page.getByRole('button', { name: /(Pausar ejecución|Pause execution)/i });
    const codeViewer = page.locator('.code-stage-panel');

    // 1. Verify scrubber is inside .stage-playback-dock and shows initial progress
    await expect(scrubber).toBeVisible();
    await expect(progressLabel).toBeVisible();
    await expect(progressLabel).toContainText(/Paso 1 de \d+/i);

    // 1b. Verify decorative icon and aria-pressed=false on initial Play button
    await expect(playBtn).toHaveAttribute('aria-pressed', 'false');
    await expect(playBtn.locator('.playback-icon-play')).toBeVisible();
    await expect(playBtn.locator('svg')).toHaveAttribute('aria-hidden', 'true');

    // 1c. Verify aria-pressed on speed buttons
    const speed1x = page.getByRole('button', { name: '1x' });
    const speed2x = page.getByRole('button', { name: '2x' });
    await expect(speed1x).toHaveAttribute('aria-pressed', 'true');
    await expect(speed2x).toHaveAttribute('aria-pressed', 'false');

    // 2. Start playback and verify pause icon & aria-pressed=true
    await playBtn.click();
    await expect(pauseBtn).toBeVisible();
    await expect(pauseBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(pauseBtn.locator('.playback-icon-pause')).toBeVisible();

    // 3. Seek to index 5
    await seekTo(scrubber, 5);

    // 4. Verify playback is stopped and play icon returns
    await expect(playBtn).toBeVisible();
    await expect(playBtn).toHaveAttribute('aria-pressed', 'false');
    await expect(playBtn.locator('.playback-icon-play')).toBeVisible();

    // 5. Verify step label and inspector update to step 6 (index 5)
    await expect(progressLabel).toContainText('Paso 6 de 19');
    await expect(page.locator('.lab-inspector-section')).toContainText('6 / 19');

    // 6. Verify CodeViewer has active line highlighted
    await expect(codeViewer.locator('.code-line-active')).toBeVisible();
  });

  test('Stack Lab: scrubber present in dock, seeking updates step, viz, and CodeViewer, and stops playback', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('./');
    await page.getByRole('button', { name: /(Switch to Stack Laboratory|Cambiar al laboratorio de pilas)/i }).click();

    const scrubber = page.locator('.visualization-stage-panel .stage-playback-dock .time-travel-scrubber');
    const progressLabel = page.locator('.visualization-stage-panel .stage-playback-dock .scrubber-progress-label');
    const playBtn = page.getByRole('button', { name: /(Reproducir ejecución automática|Play auto execution)/i });
    const pauseBtn = page.getByRole('button', { name: /(Pausar ejecución|Pause execution)/i });
    const codeViewer = page.locator('.code-stage-panel');

    await expect(scrubber).toBeVisible();
    await expect(progressLabel).toBeVisible();
    await expect(progressLabel).toContainText(/Paso 1 de \d+/i);

    // Start playback
    await playBtn.click();
    await expect(pauseBtn).toBeVisible();

    // Seek to index 3
    await seekTo(scrubber, 3);

    // Verify playback stops
    await expect(playBtn).toBeVisible();

    // Progress updates to Paso 4
    await expect(progressLabel).toContainText('Paso 4 de');
    await expect(codeViewer.locator('.code-line-active')).toBeVisible();
  });

  test('Queue Lab: scrubber present in dock, seeking updates step, viz, and CodeViewer, and stops playback', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('./');
    await page.getByRole('button', { name: /(Switch to Queue Laboratory|Cambiar al laboratorio de colas)/i }).click();

    const scrubber = page.locator('.visualization-stage-panel .stage-playback-dock .time-travel-scrubber');
    const progressLabel = page.locator('.visualization-stage-panel .stage-playback-dock .scrubber-progress-label');
    const playBtn = page.getByRole('button', { name: /(Reproducir ejecución automática|Play auto execution)/i });
    const pauseBtn = page.getByRole('button', { name: /(Pausar ejecución|Pause execution)/i });
    const codeViewer = page.locator('.code-stage-panel');

    await expect(scrubber).toBeVisible();
    await expect(progressLabel).toBeVisible();
    await expect(progressLabel).toContainText(/Paso 1 de \d+/i);

    // Start playback
    await playBtn.click();
    await expect(pauseBtn).toBeVisible();

    // Seek to index 4
    await seekTo(scrubber, 4);

    // Verify playback stops
    await expect(playBtn).toBeVisible();

    // Progress updates to Paso 5
    await expect(progressLabel).toContainText('Paso 5 de');
    await expect(codeViewer.locator('.code-line-active')).toBeVisible();
  });

  test('Linked List Lab: scrubber present in dock, seeking updates step, viz, and CodeViewer, and stops playback', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('./');
    await page.getByRole('button', { name: /(Switch to Linked List Laboratory|Cambiar al laboratorio de listas enlazadas)/i }).click();

    const scrubber = page.locator('.visualization-stage-panel .stage-playback-dock .time-travel-scrubber');
    const progressLabel = page.locator('.visualization-stage-panel .stage-playback-dock .scrubber-progress-label');
    const playBtn = page.getByRole('button', { name: /(Reproducir ejecución automática|Play auto execution)/i });
    const pauseBtn = page.getByRole('button', { name: /(Pausar ejecución|Pause execution)/i });
    const codeViewer = page.locator('.code-stage-panel');

    await expect(scrubber).toBeVisible();
    await expect(progressLabel).toBeVisible();
    await expect(progressLabel).toContainText(/Paso 1 de \d+/i);

    // Start playback
    await playBtn.click();
    await expect(pauseBtn).toBeVisible();

    // Seek to index 3
    await seekTo(scrubber, 3);

    // Verify playback stops
    await expect(playBtn).toBeVisible();

    // Progress updates to Paso 4
    await expect(progressLabel).toContainText('Paso 4 de');
    await expect(codeViewer.locator('.code-line-active')).toBeVisible();
  });

  test('Mobile 390x844: zero horizontal overflow across all 4 laboratories with scrubber present', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const labButtons = [
      { name: 'Array', selector: null },
      { name: 'Stack', selector: /(Switch to Stack Laboratory|Cambiar al laboratorio de pilas)/i },
      { name: 'Queue', selector: /(Switch to Queue Laboratory|Cambiar al laboratorio de colas)/i },
      { name: 'Linked List', selector: /(Switch to Linked List Laboratory|Cambiar al laboratorio de listas enlazadas)/i },
    ];

    for (const lab of labButtons) {
      await page.goto('./');
      if (lab.selector) {
        await page.getByRole('button', { name: lab.selector }).click();
      }

      const scrubber = page.locator('.visualization-stage-panel .stage-playback-dock .time-travel-scrubber');
      await expect(scrubber).toBeVisible();

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScroll, `Horizontal overflow detected in ${lab.name} at 390x844`).toBe(false);
    }
  });
});
