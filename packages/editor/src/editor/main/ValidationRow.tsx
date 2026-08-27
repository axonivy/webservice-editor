import { cn, MessageRow, SelectRow, TableCell, type DataTableFeatures } from '@axonivy/ui-components';
import type { Severity, ValidationResult } from '@axonivy/webservice-editor-protocol';
import { flexRender, type Row, type RowData } from '@tanstack/react-table';
import { useValidations } from '../../hooks/useValidation';

type ValidationRowProps<TData extends RowData> = {
  row: Row<DataTableFeatures, TData>;
  validationPath: string;
};

export const ValidationRow = <TData extends RowData>({ row, validationPath }: ValidationRowProps<TData>) => {
  const validations = useValidations(validationPath);
  return (
    <>
      <SelectRow row={row} className={rowClass(validations)}>
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id} style={{ width: cell.column.getSize() }} onClick={cell.getSelectionStartHandler()}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </SelectRow>
      {validations?.map((val, index) => (
        <MessageRow
          // eslint-disable-next-line @eslint-react/no-array-index-key
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
    return cn('border-b-error!');
  }
  if (validations.find(message => message.severity === 'WARNING')) {
    return cn('border-b-warning!');
  }
  return '';
};
