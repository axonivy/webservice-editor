import type { ValidationResult } from '@axonivy/webservice-editor-protocol';
import { rowClass } from './ValidationRow';

test('rowClass', () => {
  expect(rowClass([])).toEqual('');
  expect(rowClass([{ severity: 'INFO' }] as ValidationResult[])).toEqual('');
  expect(rowClass([{ severity: 'INFO' }, { severity: 'WARNING' }] as ValidationResult[])).toEqual('webservice-editor-row-warning');
  expect(rowClass([{ severity: 'INFO' }, { severity: 'ERROR' }] as ValidationResult[])).toEqual(
    'webservice-editor-row-error'
  );
});
