import { BasicCollapsible, SortableHeader, Table, TableBody, TableResizableHeader } from '@axonivy/ui-components';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useResizableEditableTable } from '../../../hooks/useResizableEditableTable';
import { ValidationRow } from '../../main/ValidationRow';
import { InputCellWithBrowser } from './InputCellWithBrowser';

type Feature = { class: string };

type FeaturesTableProps = {
  data: Array<string>;
  onChange: (props: Array<string>) => void;
  validationPath: string;
};

export const FeaturesTable = ({ data, onChange, validationPath }: FeaturesTableProps) => {
  const { t } = useTranslation();

  const tableData: Feature[] = useMemo<Array<Feature>>(() => data.map(f => ({ class: f })), [data]);

  const onTableDataChange = (changedData: Array<Feature>) => {
    onChange(changedData.map(d => d.class));
  };

  const columns = useMemo<ColumnDef<Feature, string>[]>(
    () => [
      {
        accessorKey: 'class',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
        cell: cell => <InputCellWithBrowser cell={cell} activeBrowsers={['FEATURES']} />
      }
    ],
    [t]
  );

  const { table, tableRef, setRowSelection, selectedRowActions, showAddButton } = useResizableEditableTable({
    data: tableData,
    columns,
    onChange: onTableDataChange,
    emptyDataObject: { class: '' }
  });

  return (
    <BasicCollapsible label={t('common.label.features')} controls={selectedRowActions()}>
      <div>
        <Table ref={tableRef}>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => setRowSelection({})} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <ValidationRow key={row.id} row={row} validationPath={`${validationPath}.features.${row.original.class}`} />
            ))}
          </TableBody>
        </Table>
        {showAddButton()}
      </div>
    </BasicCollapsible>
  );
};
