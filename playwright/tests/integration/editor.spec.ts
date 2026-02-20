import { expect, test } from '@playwright/test';
import { AddWebServiceDialog } from '../page-objects/AddWebServiceDialog';
import { WebServiceEditor } from '../page-objects/WebServiceEditor';

// eslint-disable-next-line playwright/no-skipped-test
test.skip('data', async ({ page }) => {
  const editor = await WebServiceEditor.openWebService(page);
  await expect(editor.main.locator.getByText('Web Services').first()).toBeVisible();
  await editor.main.table.header(0).locator.getByRole('button', { name: 'Sort by Name' }).click();
  await editor.main.table.expectToHaveRowValues(
    ['batchService', '{ivy.app.baseurl}/api/batch'],
    ['customClient', '{ivy.app.baseurl}/api/persons'],
    ['ivy.engine (local.backend)', '{ivy.app.baseurl}/api'],
    ['jsonPlaceholder', 'https://jsonplaceholder.typicode.com/']
  );
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('batchService');
});

// eslint-disable-next-line playwright/no-skipped-test
test.skip('save data', async ({ page, browserName }, testInfo) => {
  const editor = await WebServiceEditor.openWebService(page);
  const dialog = await editor.main.openAddWebServiceDialog();
  const newWebServiceName = `webservice-${browserName}-${testInfo.retry}`;
  await dialog.name.locator.fill(newWebServiceName);
  await dialog.create.click();
  const row = editor.main.table.lastRow();
  await row.expectToHaveColumnValues(newWebServiceName, '');
  await row.locator.click();
  await expect(editor.detail.header).toHaveText(newWebServiceName);
  await editor.detail.uri.locator.fill('www.axonivy.com');
  await row.expectToHaveColumnValues(newWebServiceName, 'www.axonivy.com');

  await page.reload();
  await row.expectToHaveColumnValues(newWebServiceName, 'www.axonivy.com');

  await row.locator.click();
  await editor.main.delete.click();
  await expect(row.column(0).locator).not.toHaveText(newWebServiceName);
});

test('select web service', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  await editor.main.table.expectToHaveNoSelection();
  await expect(editor.detail.header).toHaveText('Web Service');

  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('personService');

  await editor.main.table.header(0).locator.click();
  await editor.main.table.expectToHaveNoSelection();
  await expect(editor.detail.header).toHaveText('Web Service');
});

test('search', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  await editor.main.table.expectToHaveRowCount(7);
  await editor.main.search.fill('vice');
  await editor.main.table.expectToHaveRowCount(4);
});

test('sort', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  await editor.main.table.expectToHaveRowValues(['personService']);
  await editor.main.table.header(0).locator.getByRole('button', { name: 'Sort by Name' }).click();
  await editor.main.table.expectToHaveRowValues(['batchService']);
});

test('add', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  await editor.main.table.expectToHaveRowCount(7);
  const dialog = await editor.main.openAddWebServiceDialog();
  await dialog.name.locator.fill('NewWebService');
  await dialog.cancel.click();
  await editor.main.table.expectToHaveRowCount(7);
  await editor.main.openAddWebServiceDialog();
  await dialog.name.locator.fill('NewWebService');
  await dialog.create.click();
  await editor.main.table.expectToHaveRowCount(8);
  await editor.main.table.row(7).expectToHaveColumnValues('NewWebService');
  await editor.main.table.row(7).expectToBeSelected();
  await expect(editor.detail.header).toHaveText('NewWebService');
  await expect(editor.detail.id).toHaveValue(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  await editor.main.delete.click();
  await editor.main.table.expectToHaveRowCount(7);
});

test('empty', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  await editor.main.table.clear();
  await expect(editor.main.locator).toBeHidden();
  const mainPanel = page.locator('.webservice-editor-main-panel');
  const emptyMessage = mainPanel.locator('.ui-panel-message');
  await expect(emptyMessage).toBeVisible();

  await mainPanel.locator('button', { hasText: 'Add Web Service' }).click();
  const dialog = new AddWebServiceDialog(page);
  await expect(dialog.locator).toBeVisible();
  await dialog.cancel.click();
  await expect(dialog.locator).toBeHidden();

  await page.keyboard.press('a');
  await expect(dialog.locator).toBeVisible();
});
