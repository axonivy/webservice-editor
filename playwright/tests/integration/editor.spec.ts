import { expect, test } from '@playwright/test';
import { AddWebServiceDialog } from '../page-objects/AddWebServiceDialog';
import { WebServiceEditor } from '../page-objects/WebServiceEditor';

test('data', async ({ page }) => {
  const editor = await WebServiceEditor.openWebService(page);
  await expect(editor.main.locator.getByText('Web Services').first()).toBeVisible();
  await editor.main.table.header(0).locator.getByRole('button', { name: 'Sort by Name' }).click();
  await editor.main.table.expectToHaveRowValues(
    ['interceptedPersonService', '{ivy.app.baseurl}/ws/connectivity-demos/16150E1D07E8CA18'],
    ['interceptedService', '{ivy.app.baseurl}/ws/connectivity-demos/16D29AE50A7A6E34'],
    ['personService', '{ivy.app.baseurl}/ws/connectivity-demos/16150E1D07E8CA18'],
    ['smartbearTests', 'http://secure.smartbearsoftware.com/samples/testcomplete12/webservices/Service.asmx']
  );
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('interceptedPersonService');
});

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
  await editor.detail.name.locator.fill(changeName);
  await row.expectToHaveColumnValues(changeName, '');

  await page.reload();
  await row.expectToHaveColumnValues(changeName, '');

  await row.locator.click();
  await editor.main.delete.click();
  await expect(editor.main.table.locator).not.toHaveText(changeName);
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
  await editor.main.table.expectToHaveRowCount(5);
  await editor.main.search.fill('son');
  await editor.main.table.expectToHaveRowCount(2);
});

test('sort', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  await editor.main.table.expectToHaveRowValues(['personService']);
  await editor.main.table.header(0).locator.getByRole('button', { name: 'Sort by Name' }).click();
  await editor.main.table.expectToHaveRowValues(['interceptedPersonService']);
});

test('add', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  await editor.main.table.expectToHaveRowCount(5);
  const dialog = await editor.main.openAddWebServiceDialog();
  await dialog.name.locator.fill('NewWebService');
  await dialog.cancel.click();
  await editor.main.table.expectToHaveRowCount(5);
  await editor.main.openAddWebServiceDialog();
  await dialog.name.locator.fill('NewWebService');
  await dialog.create.click();
  await editor.main.table.expectToHaveRowCount(6);
  await editor.main.table.row(5).expectToHaveColumnValues('NewWebService');
  await editor.main.table.row(5).expectToBeSelected();
  await expect(editor.detail.header).toHaveText('NewWebService');
  await expect(editor.detail.id).toHaveValue(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  await editor.main.delete.click();
  await editor.main.table.expectToHaveRowCount(5);
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

test('generate service', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  await expect(editor.main.generate).toBeDisabled();
  await editor.main.table.row(0).locator.click();
  await expect(editor.main.generate).toBeEnabled();

  const dialog = await editor.main.openGenerateServiceDialog();
  await expect(dialog.namespaceInput).toBeDisabled();
  await expect(dialog.underscoreOption).toBeDisabled();

  await dialog.fileInput.fill('http://example.com/service?wsdl');
  await expect(dialog.namespaceInput).toBeEnabled();
  await expect(dialog.underscoreOption).toBeEnabled();
});
