import { expect, test } from '@playwright/test';
import { WebServiceEditor } from '../page-objects/WebServiceEditor';

test('table', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  const dialog = await editor.main.openAddWebServiceDialog();
  await dialog.name.locator.fill('invalid#client');
  await dialog.create.click();
  await expect(editor.main.table.locator.locator('.ui-message-row').first()).toHaveText('WebService invalid#client contains invalid characters');
});

test('detail', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  const dialog = await editor.main.openAddWebServiceDialog();
  await dialog.name.locator.fill('invalid#client');
  await dialog.create.click();
  await editor.main.table.lastRow().locator.click();

  await (await editor.detail.name.message()).expectToBeError('WebService invalid#client contains invalid characters');
  await editor.detail.featuresSection.open();
  await editor.detail.features.expectToHaveRowCount(0);
  const row = await editor.detail.features.addRow();
  await row.fill(['bla']);
  await editor.detail.features.expectToHaveRowCount(2);
  await expect(editor.detail.features.locator.getByRole('row').last()).toHaveText('Features unknown');
});

test('add web service', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  const dialog = await editor.main.openAddWebServiceDialog();
  await (await dialog.name.message()).expectToBeError('Name cannot be empty.');
  await dialog.name.locator.fill('personService');
  await (await dialog.name.message()).expectToBeError('Web Service already exists.');
  await dialog.name.locator.fill('personService1');
  await expect((await dialog.name.message()).locator).toBeHidden();
});
