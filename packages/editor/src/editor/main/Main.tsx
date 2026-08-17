import {
  BasicField,
  Button,
  dataTableHelper,
  deleteFirstSelectedRow,
  Flex,
  IvyIcon,
  PanelMessage,
  selectRow,
  Separator,
  SortableHeader,
  Table,
  TableBody,
  TableGlobalFilter,
  TableResizableHeader,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeys,
  useReadonly,
  useTableKeyHandler,
  type DataTableFeatures
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { WebServiceData } from '@axonivy/webservice-editor-protocol';
import { useTable, type Table as ReactTable } from '@tanstack/react-table';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useMeta } from '../../hooks/useMeta';
import { useKnownHotkeys } from '../../utils/useKnownHotkeys';
import { AddWebServiceDialog } from '../dialog/AddWebServiceDialog';
import { GenerateServiceDialog } from '../dialog/GenerateServiceDialog';
import { ValidationRow } from './ValidationRow';

const { columnHelper, tableOptions } = dataTableHelper<WebServiceData>();

export const Main = () => {
  const { t } = useTranslation();
  const { data, setData, setSelectedIndex, detail, setDetail, context } = useAppContext();
  const iconMeta = useMeta('meta/icons/all', context);

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('name', {
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
        cell: cell => {
          const iconPath = iconMeta.data?.find(icon => icon.relativePath === cell.row.original.icon)?.path;
          return (
            <Flex alignItems='center' gap={1}>
              {iconPath ? <img src={iconPath} alt='icon' className='size-3' /> : <IvyIcon icon={IvyIcons.RestClient} />}
              <span>{cell.getValue()}</span>
            </Flex>
          );
        }
        }),
        columnHelper.accessor(row => row.service.ports[0]?.locationUri ?? '', {
        id: 'uri',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.uri')} />,
        cell: cell => (
          <Flex alignItems='center' gap={1}>
            <span>{cell.getValue()}</span>
          </Flex>
        )
        })
      ]),
    [t, iconMeta.data]
  );

  const table = useTable({
    ...tableOptions,
    columnResizeMode: 'onChange',
    data,
    columns
  });

  useEffect(() => {
    const subscription = table.atoms.rowSelection.subscribe(selectedRows => {
      const selectedRowIndex = Object.keys(selectedRows).find(key => selectedRows[key]);
      setSelectedIndex(selectedRowIndex === undefined ? -1 : Number(selectedRowIndex));
    });
    return () => subscription.unsubscribe();
  }, [table, setSelectedIndex]);

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
  const firstElementRef = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusMain.hotkey, () => firstElementRef.current?.focus(), { scopes: ['global'] });

  if (data === undefined || data.length === 0) {
    return (
      <Flex direction='column' alignItems='center' justifyContent='center' className='h-full'>
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
    <Flex direction='column' ref={ref} onClick={resetSelection} className='h-full overflow-auto'>
      <BasicField
        tabIndex={-1}
        ref={firstElementRef}
        className='m-3 min-h-0'
        label={t('label.webServices')}
        control={
          <Controls table={table} deleteWebService={table.getSelectedRowModel().flatRows.length > 0 ? deleteWebService : undefined} />
        }
        onClick={event => event.stopPropagation()}
      >
        <TableGlobalFilter table={table} />
        <div className='overflow-x-hidden'>
          <Table onKeyDown={e => handleKeyDown(e, () => setDetail(!detail))}>
            <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={resetSelection} />
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <ValidationRow key={row.id} row={row} validationPath={row.original.key} />
              ))}
            </TableBody>
          </Table>
        </div>
      </BasicField>
    </Flex>
  );
};

const Controls = ({
  table,
  deleteWebService
}: {
  table: ReactTable<DataTableFeatures, WebServiceData>;
  deleteWebService?: () => void;
}) => {
  const { t } = useTranslation();
  const readonly = useReadonly();
  const hotkeys = useKnownHotkeys();
  if (readonly) {
    return null;
  }
  return (
    <Flex gap={2}>
      <GenerateServiceDialog>
        <Button
          icon={IvyIcons.SettingsCog}
          aria-label={t('dialog.generateService.title')}
          disabled={table.getSelectedRowModel().rows.length === 0}
        />
      </GenerateServiceDialog>
      <Separator decorative orientation='vertical' className='m-0! h-5!' />
      <AddWebServiceDialog table={table}>
        <Button icon={IvyIcons.Plus} aria-label={hotkeys.addWebService.label} />
      </AddWebServiceDialog>
      <Separator decorative orientation='vertical' className='m-0! h-5!' />
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
