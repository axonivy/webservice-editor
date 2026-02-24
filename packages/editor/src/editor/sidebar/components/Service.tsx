import {
  arraymove,
  BasicField,
  BasicSelect,
  Button,
  ButtonGroup,
  Flex,
  InputCell,
  Message,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  SelectRow,
  Table,
  TableBody,
  TableCell,
  type ButtonProps
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { WsPort, WsService } from '@axonivy/webservice-editor-protocol';
import { flexRender, type ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useResizableEditableTable } from '../../../hooks/useResizableEditableTable';

type ServiceProps = {
  data: WsService;
  onChange: (change: WsService) => void;
};

export const Service = ({ data, onChange }: ServiceProps) => {
  const { t } = useTranslation();
  const [selectedPort, setSelectedPort] = useState('0');

  if (!data.serviceClass) {
    return <Message variant='warning' title={t('message.serviceClassMissing')} />;
  }

  const port = data.ports[Number(selectedPort)];

  return (
    <Flex direction='column' gap={3}>
      <BasicField label={t('label.ports')}>
        <BasicSelect
          items={data.ports.map((port, index) => ({ label: port.name, value: index.toString() }))}
          value={selectedPort}
          onValueChange={setSelectedPort}
        />
      </BasicField>
      {port && (
        <EndpointTable
          port={port}
          onChange={changedPort =>
            onChange({
              ...data,
              ports: data.ports.map(p => (p.name === port.name ? changedPort : p))
            })
          }
        />
      )}
    </Flex>
  );
};

type EndpointUrl = {
  url: string;
};

const EndpointTable = ({ port, onChange }: { port: WsPort; onChange: (change: WsPort) => void }) => {
  const { t } = useTranslation();

  const tableData = useMemo<Array<EndpointUrl>>(
    () => [{ url: port.locationUri }, ...port.fallbackLocationUris.map(endpoint => ({ url: endpoint }))],
    [port]
  );

  const onTableDataChange = (changedData: Array<EndpointUrl>) => {
    onChange({
      ...port,
      locationUri: changedData[0]?.url ?? '',
      fallbackLocationUris: changedData.slice(1).map(d => d.url)
    });
  };

  const columns = useMemo<ColumnDef<EndpointUrl, string>[]>(
    () => [
      {
        accessorKey: 'url',
        cell: cell => <InputCell cell={cell} />
      }
    ],
    []
  );

  const { table, tableRef, setRowSelection, selectedRowActions, showAddButton, updateTableData } = useResizableEditableTable({
    data: tableData,
    columns,
    onChange: onTableDataChange,
    emptyDataObject: { url: '' }
  });

  const reorderAction = (): Array<ButtonProps> => {
    const firstSelectedRow = table.getSelectedRowModel().rows[0];
    if (firstSelectedRow === undefined) {
      return [];
    }
    const moveUp: ButtonProps = {
      size: 'small',
      title: t('label.moveUp'),
      'aria-label': t('label.moveUp'),
      icon: IvyIcons.ArrowRight,
      rotate: 270,
      disabled: firstSelectedRow.index === 0,
      onClick: () => {
        const newData = [...tableData];
        arraymove(newData, firstSelectedRow.index, firstSelectedRow.index - 1);
        updateTableData(newData);
        setRowSelection({ [firstSelectedRow.index - 1]: true });
      }
    };
    const moveDown: ButtonProps = {
      size: 'small',
      title: t('label.moveDown'),
      'aria-label': t('label.moveDown'),
      icon: IvyIcons.ArrowRight,
      rotate: 90,
      disabled: firstSelectedRow.index === table.getRowModel().rows.length - 1,
      onClick: () => {
        const newData = [...tableData];
        arraymove(newData, firstSelectedRow.index, firstSelectedRow.index + 1);
        updateTableData(newData);
        setRowSelection({ [firstSelectedRow.index + 1]: true });
      }
    };
    return [moveUp, moveDown];
  };

  return (
    <BasicField
      label={t('label.endpoint')}
      control={
        <Flex gap={1} direction='row'>
          <Popover>
            <PopoverTrigger asChild>
              <Button size='small' icon={IvyIcons.InfoCircle} title={t('common.label.info')} aria-label={t('common.label.info')} />
            </PopoverTrigger>
            <PopoverContent collisionPadding={5}>
              <PopoverArrow />
              {t('message.endpointInfoDescription')}
            </PopoverContent>
          </Popover>
          <ButtonGroup controls={[...reorderAction(), ...selectedRowActions()]} />
        </Flex>
      }
    >
      <div>
        <Table ref={tableRef}>
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
    </BasicField>
  );
};
