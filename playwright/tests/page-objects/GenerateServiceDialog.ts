import { type Locator, type Page } from '@playwright/test';

export class GenerateServiceDialog {
  readonly locator: Locator;
  readonly fileInput: Locator;
  readonly namespaceInput: Locator;
  readonly underscoreOption: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.locator = page.getByRole('dialog');
    this.fileInput = this.locator.getByRole('textbox', { name: 'WSDL URI' });
    this.namespaceInput = this.locator.getByRole('textbox', { name: 'Namespace' });
    this.underscoreOption = this.locator.getByRole('checkbox', { name: 'Keep Underscores in Names' });
    this.submitButton = this.locator.getByRole('button', { name: 'Generate' });
  }
}
