import { expect, test } from '@playwright/test';
import { WebServiceEditor } from '../page-objects/WebServiceEditor';

test('empty', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  await expect(editor.detail.header).toHaveText('Web Service');
  await expect(editor.detail.content).toBeHidden();
  const emptyMessage = editor.detail.locator.locator('.ui-panel-message');
  await expect(emptyMessage).toBeVisible();
  await expect(emptyMessage).toHaveText('No Web Service Selected');
});

test('edit details', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('personService');
  await expect(editor.detail.content).toBeVisible();
  await expect(editor.detail.id).toBeDisabled();
  await expect(editor.detail.name.locator).toHaveValue('personService');
  await expect(editor.detail.description).toBeEmpty();
  await expect(editor.detail.icon).toBeEmpty();
  await expect(editor.detail.uri.locator).toHaveValue('{ivy.app.baseurl}/api/persons');

  await editor.detail.name.locator.fill('Updated service');
  await editor.detail.description.fill('desc');
  await editor.detail.icon.fill('file://icon');
  await editor.detail.uri.locator.fill('{ivy.app.baseurl}/api/updatedService');

  await expect(editor.detail.header).toHaveText('Updated service');
  await expect(editor.detail.name.locator).toHaveValue('Updated service');
  await expect(editor.detail.description).toHaveValue('desc');
  await expect(editor.detail.icon).toHaveValue('file://icon');
  await expect(editor.detail.uri.locator).toHaveValue('{ivy.app.baseurl}/api/updatedService');
});

test('edit authentication type', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await editor.detail.authSection.open();
  await editor.detail.authenticationType.expectSelected('Basic');
  await editor.detail.featuresSection.open();
  await editor.detail.features.expectToHaveRowCount(2);
  await editor.detail.features.expectToHaveRowValues(
    ['ch.ivyteam.ivy.rest.client.authentication.HttpBasicAuthenticationFeature'],
    ['ch.ivyteam.ivy.rest.client.mapper.JsonFeature']
  );

  await editor.detail.authenticationType.choose('Digest');
  await editor.detail.features.expectToHaveRowCount(2);
  await editor.detail.features.expectToHaveRowValues(
    ['ch.ivyteam.ivy.rest.client.mapper.JsonFeature'],
    ['ch.ivyteam.ivy.rest.client.authentication.HttpDigestAuthenticationFeature']
  );

  await editor.detail.authenticationType.choose('NTLM');
  await editor.detail.features.expectToHaveRowCount(2);
  await editor.detail.features.expectToHaveRowValues(['ch.ivyteam.ivy.rest.client.mapper.JsonFeature'], ['ch.ivyteam.ivy.rest.client.authentication.NtlmAuthenticationFeature']);

  await editor.detail.authenticationType.choose('None');
  await editor.detail.features.expectToHaveRowCount(1);
  await editor.detail.features.expectToHaveRowValues(['ch.ivyteam.ivy.rest.client.mapper.JsonFeature']);
});

test('edit authentication properties', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await editor.detail.authSection.open();
  await expect(editor.detail.username).toHaveValue('theWorker');
  await expect(editor.detail.password).toHaveValue('theWorker');
  await editor.detail.propertiesSection.open();
  await editor.detail.properties.expectToHaveRowValues(['Text', 'username', 'theWorker'], ['Password', 'password', 'theWorker']);

  await editor.detail.username.fill('newUser');
  await editor.detail.properties.expectToHaveRowValues(['Text', 'username', 'newUser'], ['Password', 'password', 'theWorker']);

  await editor.detail.password.fill('newPass');
  await editor.detail.properties.expectToHaveRowValues(['Text', 'username', 'newUser'], ['Password', 'password', 'newPass']);

  await editor.detail.username.clear();
  await editor.detail.properties.expectToHaveRowValues(['Password', 'password', 'newPass']);

  await editor.detail.username.fill('reguel');
  await editor.detail.properties.expectToHaveRowValues(['Password', 'password', 'newPass'], ['Text', 'username', 'reguel']);

  await editor.detail.password.clear();
  await editor.detail.properties.expectToHaveRowValues(['Text', 'username', 'reguel']);
});

test('edit features', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await editor.detail.featuresSection.open();
  await editor.detail.features.expectToHaveRowValues(
    ['ch.ivyteam.ivy.rest.client.authentication.HttpBasicAuthenticationFeature'],
    ['ch.ivyteam.ivy.rest.client.mapper.JsonFeature']
  );

  const newRow = await editor.detail.features.addRow();
  await newRow.fill(['test']);
  await editor.detail.features.expectToHaveRowValues(
    ['ch.ivyteam.ivy.rest.client.authentication.HttpBasicAuthenticationFeature'],
    ['ch.ivyteam.ivy.rest.client.mapper.JsonFeature'],
    ['test']
  );

  await editor.detail.features.row(1).locator.click();
  await editor.detail.featuresSection.content.getByRole('button', { name: 'Remove Row' }).click();
  await editor.detail.features.expectToHaveRowValues(['ch.ivyteam.ivy.rest.client.authentication.HttpBasicAuthenticationFeature'], ['test']);
});

test('edit properties', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await editor.detail.propertiesSection.open();
  await editor.detail.properties.expectToHaveRowValues(['Text', 'username', 'theWorker'], ['Password', 'password', 'theWorker']);

  const newRow = await editor.detail.properties.addRow();
  await newRow.fill(['Path', 'newProp', 'newValue']);
  await editor.detail.properties.expectToHaveRowValues(['Text', 'username', 'theWorker'], ['Password', 'password', 'theWorker'], ['Path', 'newProp', 'newValue']);

  await editor.detail.properties.row(0).locator.click();
  await editor.detail.propertiesSection.content.getByRole('button', { name: 'Remove Row' }).click();
  await editor.detail.properties.expectToHaveRowValues(['Password', 'password', 'theWorker'], ['Path', 'newProp', 'newValue']);
});

test('keyboard properties', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Somehow not correclty working in webkit');
  const editor = await WebServiceEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await editor.detail.propertiesSection.open();
  await editor.detail.properties.expectToHaveRowValues(['Text', 'username', 'theWorker'], ['Password', 'password', 'theWorker']);
  await editor.detail.properties.row(0).column(1).locator.click();
  await page.keyboard.type('1');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await editor.detail.properties.expectToHaveRowCount(3);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.type('new');
  await page.keyboard.press('Escape');
  await editor.detail.properties.expectToHaveRowValues(['Text', 'username1', 'theWorker'], ['Password', 'password', 'theWorker'], ['Text', 'new', '']);
});
