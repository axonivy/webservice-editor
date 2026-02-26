import { test } from '@playwright/test';
import { WebServiceEditor } from '../page-objects/WebServiceEditor';
import { screenshotElement } from './screenshot-util';

test('add web service', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  const dialog = await editor.main.openAddWebServiceDialog();
  await dialog.name.locator.fill('New WebService');
  await screenshotElement(dialog.locator, 'dialog-add-webservice');
});

test('generate web service', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  const dialog = await editor.main.openGenerateServiceDialog();
  await screenshotElement(dialog.locator, 'dialog-generate-webservice');
});
