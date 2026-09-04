import { test, expect } from '@playwright/test';

test.describe('Navigation & Application Shell', () => {
  test('loads application and navigates across all four laboratories', async ({ page }) => {
    await page.goto('./');

    await expect(page).toHaveTitle(/CASE Algorithms/i);
    await expect(page.locator('.app-header-title')).toHaveText('CASE Algorithms');

    const arrayBtn = page.getByRole('button', { name: 'Switch to Array Laboratory' });
    const stackBtn = page.getByRole('button', { name: 'Switch to Stack Laboratory' });
    const queueBtn = page.getByRole('button', { name: 'Switch to Queue Laboratory' });
    const linkedListBtn = page.getByRole('button', { name: 'Switch to Linked List Laboratory' });

    await expect(arrayBtn).toBeVisible();
    await expect(stackBtn).toBeVisible();
    await expect(queueBtn).toBeVisible();
    await expect(linkedListBtn).toBeVisible();

    await arrayBtn.click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Array & Bubble Sort');
    await expect(page.locator('.header-breadcrumbs')).toContainText('Array & Bubble Sort');

    await stackBtn.click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Stack & LIFO');
    await expect(page.locator('.header-breadcrumbs')).toContainText('Stack & LIFO');

    await queueBtn.click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Queue & FIFO');
    await expect(page.locator('.header-breadcrumbs')).toContainText('Queue & FIFO');

    await linkedListBtn.click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Singly Linked List');
    await expect(page.locator('.header-breadcrumbs')).toContainText('Singly Linked List');
  });

  test('toggles theme between dark and light modes', async ({ page }) => {
    await page.goto('./');

    const themeToggle = page.locator('.theme-toggle-btn');
    await expect(themeToggle).toBeVisible();

    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(initialTheme).toBe('dark');

    await themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});
