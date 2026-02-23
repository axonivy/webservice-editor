import {
  BasicField,
  Button,
  deleteFirstSelectedRow,
  Flex,
  IvyIcon,
  PanelMessage,
  selectRow,
  Separator,
  SortableHeader,
  Table,
  TableBody,
  TableResizableHeader,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeys,
  useReadonly,
  useTableGlobalFilter,
  useTableKeyHandler,
  useTableSelect,
  useTableSort
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { WebServiceData } from '@axonivy/webservice-editor-protocol';
import { getCoreRowModel, useReactTable, type ColumnDef, type Table as ReactTable } from '@tanstack/react-table';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useKnownHotkeys } from '../../utils/useKnownHotkeys';
import { AddWebServiceDialog } from '../dialog/AddWebServiceDialog';
import './Main.css';
import { ValidationRow } from './ValidationRow';

export const Main = () => {
  const { t } = useTranslation();
  const { data, setData, setSelectedIndex, detail, setDetail } = useAppContext();

  const selection = useTableSelect<WebServiceData>({
    onSelect: selectedRows => {
      const selectedRowIndex = Object.keys(selectedRows).find(key => selectedRows[key]);
      if (selectedRowIndex === undefined) {
        setSelectedIndex(-1);
        return;
      }
      setSelectedIndex(Number(selectedRowIndex));
    }
  });
  const globalFilter = useTableGlobalFilter();
  const sort = useTableSort();
  const columns = useMemo<ColumnDef<WebServiceData, string>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
        cell: cell => (
          <Flex alignItems='center' gap={1}>
            {<IvyIcon icon={IvyIcons.User} />}
            <span>{cell.getValue()}</span>
          </Flex>
        )
      },
      {
        id: 'uri',
        accessorFn: row => row.service.ports[0]?.locationUri ?? '',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.uri')} />,
        cell: cell => (
          <Flex alignItems='center' gap={1}>
            <span>{cell.getValue()}</span>
          </Flex>
        )
      }
    ],
    [t]
  );

  const table = useReactTable({
    ...selection.options,
    ...globalFilter.options,
    ...sort.options,
    columnResizeMode: 'onChange',
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...selection.tableState,
      ...sort.tableState,
      ...globalFilter.tableState
    }
  });

  const { handleKeyDown } = useTableKeyHandler({
    table,
    data
  });

  const deleteWebService = () =>
    setData(old => {
      const selectedRow = table.getSelectedRowModel().flatRows[0];
      if (!selectedRow) {
        return old;
      }
      return deleteFirstSelectedRow(table, old).newData;
    });

  const resetSelection = () => {
    selectRow(table);
  };

  const hotkeys = useKnownHotkeys();
  const readonly = useReadonly();
  const ref = useHotkeys<HTMLDivElement>(hotkeys.deleteWebService.hotkey, () => deleteWebService(), {
    scopes: ['global'],
    enabled: !readonly
  });
  const firstElement = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusMain.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });

  if (data === undefined || data.length === 0) {
    return (
      <Flex direction='column' alignItems='center' justifyContent='center' style={{ height: '100%' }}>
        <PanelMessage icon={IvyIcons.Tool} message={t('message.addFirstWebService')} mode='column'>
          <AddWebServiceDialog table={table}>
            <Button size='large' variant='primary' icon={IvyIcons.Plus}>
              {t('dialog.addWebService.title')}
            </Button>
          </AddWebServiceDialog>
        </PanelMessage>
      </Flex>
    );
  }

  return (
    <Flex direction='column' ref={ref} onClick={resetSelection} className='webservice-editor-main-content'>
      <BasicField
        tabIndex={-1}
        ref={firstElement}
        className='webservice-editor-table-field'
        label={t('label.webServices')}
        control={
          <Controls table={table} deleteWebService={table.getSelectedRowModel().flatRows.length > 0 ? deleteWebService : undefined} />
        }
        onClick={event => event.stopPropagation()}
      >
        {globalFilter.filter}
        <div className='webservice-editor-table-container'>
          <Table onKeyDown={e => handleKeyDown(e, () => setDetail(!detail))}>
            <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={resetSelection} />
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <ValidationRow key={row.id} row={row} validationPath={row.original.name} />
              ))}
            </TableBody>
          </Table>
        </div>
      </BasicField>
    </Flex>
  );
};

const Controls = ({ table, deleteWebService }: { table: ReactTable<WebServiceData>; deleteWebService?: () => void }) => {
  const readonly = useReadonly();
  const hotkeys = useKnownHotkeys();
  if (readonly) {
    return null;
  }
  return (
    <Flex gap={2}>
      <AddWebServiceDialog table={table}>
        <Button icon={IvyIcons.Plus} aria-label={hotkeys.addWebService.label} />
      </AddWebServiceDialog>
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              icon={IvyIcons.Trash}
              onClick={deleteWebService}
              disabled={deleteWebService === undefined}
              aria-label={hotkeys.deleteWebService.label}
            />
          </TooltipTrigger>
          <TooltipContent>{hotkeys.deleteWebService.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Flex>
  );
};
