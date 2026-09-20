import { test, expect } from '@playwright/test';

test.describe('Navigation & Application Shell', () => {
  test('loads application and navigates across all four laboratories', async ({ page }) => {
    await page.goto('./');

    await expect(page).toHaveTitle(/CASE Algorithms/i);
    await expect(page.locator('.app-header-title')).toHaveText('CASE Algorithms');

    const arrayBtn = page.getByRole('button', { name: /(Switch to Array Laboratory|Cambiar al laboratorio de arreglos)/i });
    const stackBtn = page.getByRole('button', { name: /(Switch to Stack Laboratory|Cambiar al laboratorio de pilas)/i });
    const queueBtn = page.getByRole('button', { name: /(Switch to Queue Laboratory|Cambiar al laboratorio de colas)/i });
    const linkedListBtn = page.getByRole('button', { name: /(Switch to Linked List Laboratory|Cambiar al laboratorio de listas enlazadas)/i });

    await expect(arrayBtn).toBeVisible();
    await expect(stackBtn).toBeVisible();
    await expect(queueBtn).toBeVisible();
    await expect(linkedListBtn).toBeVisible();

    await arrayBtn.click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Array & Bubble Sort');
    await expect(page.locator('.header-breadcrumbs')).toContainText(/(Array & Bubble Sort|Arreglo y Ordenamiento Burbuja)/i);

    await stackBtn.click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Stack & LIFO');
    await expect(page.locator('.header-breadcrumbs')).toContainText(/(Stack & LIFO|Pila y Principio LIFO)/i);

    await queueBtn.click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Queue & FIFO');
    await expect(page.locator('.header-breadcrumbs')).toContainText(/(Queue & FIFO|Cola y Principio FIFO)/i);

    await linkedListBtn.click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Singly Linked List');
    await expect(page.locator('.header-breadcrumbs')).toContainText(/(Singly Linked List|Lista Simplemente Enlazada)/i);
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
