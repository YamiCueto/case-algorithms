import { test, expect } from '@playwright/test';

test.describe('Navigation & Application Shell', () => {
  test('loads application and navigates across all four laboratories in Spanish and English', async ({ page }) => {
    await page.goto('./');

    await expect(page).toHaveTitle(/CASE Algorithms/i);
    await expect(page.locator('.app-header-title')).toHaveText('CASE Algorithms');

    const arrayBtnEs = page.getByRole('button', { name: 'Cambiar al laboratorio de arreglos' });
    const stackBtnEs = page.getByRole('button', { name: 'Cambiar al laboratorio de pilas' });
    const queueBtnEs = page.getByRole('button', { name: 'Cambiar al laboratorio de colas' });
    const linkedListBtnEs = page.getByRole('button', { name: 'Cambiar al laboratorio de listas enlazadas' });

    await expect(arrayBtnEs).toBeVisible();
    await expect(stackBtnEs).toBeVisible();
    await expect(queueBtnEs).toBeVisible();
    await expect(linkedListBtnEs).toBeVisible();

    await arrayBtnEs.click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Exploración de Arreglos y Ordenamiento Burbuja');
    await expect(page.locator('.header-breadcrumbs')).toContainText('Arreglo y Ordenamiento Burbuja');

    await stackBtnEs.click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Exploración de Pilas y Principio LIFO');
    await expect(page.locator('.header-breadcrumbs')).toContainText('Pila y Principio LIFO');

    await queueBtnEs.click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Exploración de Colas y Principio FIFO');
    await expect(page.locator('.header-breadcrumbs')).toContainText('Cola y Principio FIFO');

    await linkedListBtnEs.click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lista simplemente enlazada y cadenas de punteros');
    await expect(page.locator('.header-breadcrumbs')).toContainText('Lista Simplemente Enlazada y Cadenas de Punteros');

    const enRadio = page.getByRole('radio', { name: 'Switch to English' });
    await enRadio.click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Singly Linked List & Pointer Chains');
    await expect(page.locator('.header-breadcrumbs')).toContainText('Singly Linked List & Pointer Chains');

    const arrayBtnEn = page.getByRole('button', { name: 'Switch to Array Laboratory' });
    const stackBtnEn = page.getByRole('button', { name: 'Switch to Stack Laboratory' });
    const queueBtnEn = page.getByRole('button', { name: 'Switch to Queue Laboratory' });
    const linkedListBtnEn = page.getByRole('button', { name: 'Switch to Linked List Laboratory' });

    await arrayBtnEn.click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Array & Bubble Sort Exploration');
    await expect(page.locator('.header-breadcrumbs')).toContainText('Array & Bubble Sort');

    await stackBtnEn.click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Stack & LIFO Principle Exploration');
    await expect(page.locator('.header-breadcrumbs')).toContainText('Stack & LIFO Principle');

    await queueBtnEn.click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Queue & FIFO Principle Exploration');
    await expect(page.locator('.header-breadcrumbs')).toContainText('Queue & FIFO Principle');

    await linkedListBtnEn.click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Singly Linked List & Pointer Chains');
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
