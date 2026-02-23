import { expect, test } from '@playwright/test';
import { WebServiceEditor } from '../page-objects/WebServiceEditor';

test('theme light', async ({ page }) => {
  await WebServiceEditor.openWebService(page, { theme: 'light' });
  await expect(page.locator('html')).toHaveClass('light');
});

test('theme dark', async ({ page }) => {
  await WebServiceEditor.openWebService(page, { theme: 'dark' });
  await expect(page.locator('html')).toHaveClass('dark');
});

test('readonly false', async ({ page }) => {
  const editor = await WebServiceEditor.openWebService(page, { readonly: false });
  await expect(editor.toolbar.redo).toBeVisible();
  await expect(editor.toolbar.undo).toBeVisible();
  await expect(editor.main.add).toBeVisible();
  await expect(editor.main.delete).toBeVisible();
});

test('readonly true', async ({ page }) => {
  const editor = await WebServiceEditor.openWebService(page, { readonly: true });
  await expect(editor.main.locator).toBeVisible();
  await expect(editor.toolbar.redo).toBeHidden();
  await expect(editor.toolbar.undo).toBeHidden();
  await expect(editor.main.add).toBeHidden();
  await expect(editor.main.delete).toBeHidden();

  await page.keyboard.press('a');
  await expect(page.getByRole('dialog')).toBeHidden();
});
