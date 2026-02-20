import type { WebServiceProperty } from '@axonivy/webservice-editor-protocol';
import {
  BasicCollapsible,
  InputCell,
  SelectCell,
  SelectRow,
  SortableHeader,
  Table,
  TableBody,
  TableCell,
  TableResizableHeader
} from '@axonivy/ui-components';
import { flexRender, type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useResizableEditableTable } from '../../../hooks/useResizableEditableTable';
import { InputCellWithBrowser } from './InputCellWithBrowser';

type PropertiesTableProps = {
  data: Array<WebServiceProperty>;
  onChange: (props: Array<WebServiceProperty>) => void;
};

export const PropertiesTable = ({ data, onChange }: PropertiesTableProps) => {
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<WebServiceProperty, string>[]>(
    () => [
      {
        accessorKey: 'type',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.type')} />,
        cell: cell => (
          <SelectCell
            cell={cell}
            items={[
              { label: t('common.label.text'), value: 'STRING' },
              { label: t('common.label.password'), value: 'PASSWORD' },
              { label: t('common.label.path'), value: 'PATH' }
            ]}
          />
        )
      },
      {
        accessorKey: 'key',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
        cell: cell => <InputCellWithBrowser cell={cell} activeBrowsers={['PROPERTIES']} />
      },
      {
        accessorKey: 'value',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.value')} />,
        cell: cell => {
          return cell.row.original.type === 'PASSWORD' ? <InputCell cell={cell} type='password' /> : <InputCell cell={cell} />;
        }
      }
    ],
    [t]
  );

  const { table, tableRef, setRowSelection, selectedRowActions, showAddButton } = useResizableEditableTable({
    data,
    columns,
    onChange,
    emptyDataObject: { type: 'STRING', key: '', value: '' }
  });

  return (
    <BasicCollapsible label={t('common.label.properties')} controls={selectedRowActions()}>
      <div>
        <Table ref={tableRef}>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => setRowSelection({})} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <SelectRow key={row.id} row={row}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </SelectRow>
            ))}
          </TableBody>
        </Table>
        {showAddButton()}
      </div>
    </BasicCollapsible>
  );
};
