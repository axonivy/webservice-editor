import type { Severity, ValidationResult } from '@axonivy/webservice-editor-protocol';
import { MessageRow, SelectRow, TableCell } from '@axonivy/ui-components';
import { flexRender, type Row } from '@tanstack/react-table';
import { useValidations } from '../../hooks/useValidation';
import './ValidationRow.css';

type ValidationRowProps<TData> = {
  row: Row<TData>;
  validationPath: string;
};

export const ValidationRow = <TData,>({ row, validationPath }: ValidationRowProps<TData>) => {
  const validations = useValidations(validationPath);
  return (
    <>
      <SelectRow row={row} className={rowClass(validations)}>
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </SelectRow>
      {validations?.map((val, index) => (
        <MessageRow
          key={`${index}-${val.message}`}
          columnCount={row.getVisibleCells().length}
          message={{ message: val.message, variant: val.severity.toLocaleLowerCase() as Lowercase<Severity> }}
        />
      ))}
    </>
  );
};

export const rowClass = (validations?: Array<ValidationResult>) => {
  if (!validations) {
    return '';
  }
  if (validations.find(message => message.severity === 'ERROR')) {
    return 'webservice-editor-row-error';
  }
  if (validations.find(message => message.severity === 'WARNING')) {
    return 'webservice-editor-row-warning';
  }
  return '';
};
