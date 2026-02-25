import { expect, test } from '@playwright/test';
import { Browser } from '../page-objects/Browser';
import { WebServiceEditor } from '../page-objects/WebServiceEditor';

test('features', async ({ page }) => {
  const editor = await WebServiceEditor.openWebService(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('personService');
  await editor.detail.featuresSection.open();
  await editor.detail.features.row(0).expectToHaveColumnValues('ch.ivyteam.ivy.webservice.exec.cxf.feature.HttpBasicAuthenticationFeature');
  await editor.detail.features.row(0).locator.click();
  await editor.detail.features.locator.getByRole('button', { name: 'Browser' }).click();
  const browser = new Browser(page);
  await expect(browser.view).toBeVisible();
  await expect(browser.view.getByRole('textbox')).toHaveValue('HttpBasicAuthenticationFeature');
  await browser.table.expectToHaveRowCount(1);
  await browser.table.expectToHaveRowValues(['HttpBasicAuthenticationFeaturech.ivyteam.ivy.webservice.exec.cxf.feature']);

  await browser.view.getByRole('textbox').clear();
  await browser.table.expectToHaveRowCount(8);
  await browser.table.expectToHaveRowValues(['MyFeaturecom.axonivy.connectivity.ws.client.connect'], ['HttpBasicAuthenticationFeaturech.ivyteam.ivy.webservice.exec.cxf.feature']);
});

test('features apply', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('personService');
  await editor.detail.featuresSection.open();
  await editor.detail.features.row(0).expectToHaveColumnValues('ch.ivyteam.ivy.webservice.exec.cxf.feature.HttpBasicAuthenticationFeature');
  await editor.detail.features.row(0).locator.click();
  await editor.detail.features.locator.getByRole('button', { name: 'Browser' }).click();
  const browser = new Browser(page);
  await expect(browser.view).toBeVisible();
  await browser.view.getByRole('textbox').clear();
  await browser.table.expectToHaveRowCount(2);
  await browser.table.row(0).locator.click();
  await browser.view.getByRole('button', { name: 'Apply' }).click();
  await editor.detail.features.row(0).expectToHaveColumnValues('ch.ivyteam.ivy.webservice.exec.cxf.feature.policy.IgnorePolicyFeature');
});

test('properties', async ({ page }) => {
  const editor = await WebServiceEditor.openWebService(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('personService');
  await editor.detail.propertiesSection.open();
  await editor.detail.properties.row(0).expectToHaveColumnValues('Text', 'username', 'theBoss');
  await editor.detail.properties.row(0).column(1).locator.click();
  await editor.detail.properties.locator.getByRole('button', { name: 'Browser' }).click();
  const browser = new Browser(page);
  await expect(browser.view).toBeVisible();
  await expect(browser.view.getByRole('textbox')).toHaveValue('username');
  await browser.table.expectToHaveRowCount(2);
  await browser.table.expectToHaveRowValues(
    ['proxy.auth.usernameThe user name used to authenticate against the proxy server. Used by the ch.ivyteam.ivy.webservice.exec.cxf.feature.ProxyFeature'],
    ['usernameThe username used to authenticate on the remote web service']
  );

  await browser.table.row(1).locator.click();
  await expect(browser.info.content).toHaveText('InfoThe username used to authenticate on the remote web service');

  await browser.view.getByRole('textbox').clear();
  await browser.table.expectToHaveRowCount(20);
  await browser.table.expectToHaveRowValues([
    'NTLM.challengeWhether to authenticate via NTLM by responding to auth-challenges. Used by the ch.ivyteam.ivy.webservice.exec.cxf.feature.NTLMAuthenticationFeature'
  ]);

  await browser.table.row(0).locator.click();
  await expect(browser.info.content).toHaveText(
    'InfoWhether to authenticate via NTLM by responding to auth-challenges. Used by the ch.ivyteam.ivy.webservice.exec.cxf.feature.NTLMAuthenticationFeatureDefault value: true'
  );
});

test('properties apply', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('personService');
  await editor.detail.propertiesSection.open();
  await editor.detail.properties.row(0).expectToHaveColumnValues('Text', 'username', 'theBoss');
  await editor.detail.properties.row(0).column(1).locator.click();
  await editor.detail.properties.locator.getByRole('button', { name: 'Browser' }).click();
  const browser = new Browser(page);
  await expect(browser.view).toBeVisible();
  await browser.view.getByRole('textbox').clear();
  await browser.table.expectToHaveRowCount(4);
  await browser.table.row(0).locator.click();
  await browser.view.getByRole('button', { name: 'Apply' }).click();
  await editor.detail.properties.row(0).expectToHaveColumnValues('Text', 'javax.xml.ws.client.connectionTimeout', 'theBoss');
});
