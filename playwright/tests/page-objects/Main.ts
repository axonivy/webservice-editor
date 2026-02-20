import { expect, type Locator, type Page } from '@playwright/test';
import { AddWebServiceDialog } from './AddWebServiceDialog';
import { Table } from './components/Table';

export class Main {
  readonly locator: Locator;
  readonly add: Locator;
  readonly delete: Locator;
  readonly search: Locator;
  readonly table: Table;

  constructor(readonly page: Page) {
    this.locator = page.locator('.webservice-editor-main-content');
    this.add = this.locator.getByRole('button', { name: 'Add Web Service' });
    this.delete = this.locator.getByRole('button', { name: 'Delete Web Service' });
    this.search = this.locator.getByRole('textbox').first();
    this.table = new Table(page, this.locator, ['text', 'text']);
  }

  public async openAddWebServiceDialog() {
    await this.add.click();
    const dialog = new AddWebServiceDialog(this.page);
    await expect(dialog.locator).toBeVisible();
    return dialog;
  }
}
