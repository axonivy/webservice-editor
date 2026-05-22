import test, { expect } from '@playwright/test';
import { WebServiceEditor } from '../page-objects/WebServiceEditor';

test('save data', async ({ page, browserName }, testInfo) => {
  const editor = await WebServiceEditor.openWebService(page);
  const dialog = await editor.main.openAddWebServiceDialog();
  const newWebServiceName = `webservice-${browserName}-${testInfo.retry}`;
  await dialog.name.locator.fill(newWebServiceName);
  await dialog.create.click();
  const row = editor.main.table.lastRow();
  await row.expectToHaveColumnValues(newWebServiceName, '');
  await row.locator.click();
  await expect(editor.detail.header).toHaveText(newWebServiceName);

  const changeName = `change-${browserName}-${testInfo.retry}`;
  await editor.detail.name.fill(changeName);
  await row.expectToHaveColumnValues(changeName, '');

  await page.reload();
  await row.expectToHaveColumnValues(changeName, '');

  await row.locator.click();
  await editor.main.delete.click();
  await expect(editor.main.table.locator).not.toHaveText(changeName);
});

test('icon chooser client', async ({ page }) => {
  const editor = await WebServiceEditor.openWebService(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.icon.locator).toHaveValue('');

  await editor.detail.icon.choose('microsoft');
  await expect(editor.detail.icon.locator).toHaveValue('res:/webContent/icons/microsoft.svg');
  const selectedRow = editor.main.table.row(0);
  const iconInRow = selectedRow.locator.locator('img');
  for (const img of await iconInRow.all()) {
    await expect(img).toHaveJSProperty('complete', true);
    await expect(img).not.toHaveJSProperty('naturalWidth', 0);
  }
  await editor.detail.icon.locator.fill('');
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.icon.locator).toHaveValue('');
});
