import { test } from '@playwright/test';
import { WebServiceEditor } from '../page-objects/WebServiceEditor';
import { screenshot } from './screenshot-util';

test('editor', async ({ page }) => {
  const editor = await WebServiceEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await screenshot(page, 'webservice-editor');
});
