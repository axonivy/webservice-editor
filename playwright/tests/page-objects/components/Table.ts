import { expect, type Locator, type Page } from '@playwright/test';
import { Select } from './Select';

export type ColumnType = 'text' | 'input' | 'select' | 'combobox';

export class Table {
  readonly locator: Locator;
  readonly headers: Locator;
  readonly rows: Locator;

  constructor(
    readonly page: Page,
    parent: Locator,
    readonly columns: ColumnType[]
  ) {
    this.locator = parent.locator('table');
    this.headers = this.locator.locator('th');
    this.rows = this.locator.locator('tbody').getByRole('row');
  }

  header(index: number) {
    return new Header(this.headers, index);
  }

  row(index: number) {
    return new Row(this.page, this.rows.nth(index), this.columns);
  }

  lastRow() {
    return new Row(this.page, this.rows.last(), this.columns);
  }

  async addRow() {
    const totalRows = await this.rows.count();
    await this.page.getByRole('button', { name: 'Add row' }).click();
    return this.row(totalRows);
  }

  async expectToHaveNoSelection() {
    for (let i = 0; i < (await this.rows.count()); i++) {
      const row = this.row(i);
      await row.expectNotToBeSelected();
    }
  }

  async expectToHaveRowValues(...rows: Array<Array<string>>) {
    for (let i = 0; i < rows.length; i++) {
      await this.row(i).expectToHaveColumnValues(...rows[i]!);
    }
  }

  async clear() {
    let totalRows = await this.rows.count();
    while (totalRows > 0) {
      await this.row(totalRows - 1).locator.click();
      await this.page.keyboard.press('Delete');
      await expect(this.rows).toHaveCount(totalRows - 1);
      totalRows = await this.rows.count();
    }
  }

  async expectToHaveRowCount(expectedCount: number) {
    await expect(this.rows).toHaveCount(expectedCount);
  }
}

export class Header {
  readonly locator: Locator;
  readonly content: Locator;

  constructor(headers: Locator, index: number) {
    this.locator = headers.nth(index);
    this.content = this.locator.locator('span');
  }
}

export class Row {
  readonly locator: Locator;

  constructor(
    readonly page: Page,
    row: Locator,
    readonly columns: ColumnType[]
  ) {
    this.locator = row;
  }

  column(index: number) {
    return new Cell(this.page, this.locator, index, this.columns[index]!);
  }

  async fill(values: string[]) {
    for (let i = 0; i < values.length; i++) {
      const cell = this.column(i);
      await cell.fill(values[i]!);
    }
  }

  async expectToBeSelected() {
    await expect(this.locator).toHaveAttribute('data-state', 'selected');
  }

  async expectNotToBeSelected() {
    await expect(this.locator).toHaveAttribute('data-state', 'unselected');
  }

  async expectToHaveColumnValues(...values: Array<string>) {
    for (let i = 0; i < values.length; i++) {
      await this.column(i).expectToHaveValue(values[i]!);
    }
  }
}

export class Cell {
  readonly locator: Locator;
  readonly inputCell: Locator;
  readonly selectCell: Select;

  constructor(
    readonly page: Page,
    row: Locator,
    index: number,
    readonly columnType: ColumnType
  ) {
    this.locator = row.getByRole('cell').nth(index);
    this.inputCell = this.locator.getByRole('textbox');
    this.selectCell = new Select(page, this.locator);
  }

  async fill(value: string) {
    switch (this.columnType) {
      case 'input':
        await this.fillText(value);
        break;
      case 'select':
      case 'combobox':
        await this.selectCell.choose(value);
        break;
    }
  }

  private async fillText(value: string) {
    await this.inputCell.fill(value);
    await this.inputCell.blur();
  }

  async expectToHaveValue(value: string) {
    switch (this.columnType) {
      case 'text':
        await expect(this.locator).toHaveText(value);
        break;
      case 'input':
        await expect(this.inputCell).toHaveValue(value);
        break;
      case 'select':
      case 'combobox':
        await this.selectCell.expectValue(value);
        break;
    }
  }
}
