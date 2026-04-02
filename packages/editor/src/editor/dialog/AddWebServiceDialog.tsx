import {
  BasicDialogContent,
  BasicField,
  Button,
  configKeySanitize,
  Dialog,
  DialogContent,
  DialogTrigger,
  hotkeyText,
  Input,
  selectRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useDialogHotkeys,
  useHotkeys,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { WebServiceData } from '@axonivy/webservice-editor-protocol';
import type { Table } from '@tanstack/react-table';
import { useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useKnownHotkeys } from '../../utils/useKnownHotkeys';
import { useValidateKey } from './useValidateKey';

const DIALOG_HOTKEY_IDS = ['addWebServiceDialog'];

export const AddWebServiceDialog = ({ table, children }: { table: Table<WebServiceData>; children: ReactNode }) => {
  const { open, onOpenChange } = useDialogHotkeys(DIALOG_HOTKEY_IDS);
  const { addWebService: shortcut } = useKnownHotkeys();
  useHotkeys(shortcut.hotkey, () => onOpenChange(true), { scopes: ['global'], keyup: true, enabled: !open });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>{children}</DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{shortcut.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent onCloseAutoFocus={e => e.preventDefault()}>
        <AddDialogContent table={table} closeDialog={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

const AddDialogContent = ({ table, closeDialog }: { table: Table<WebServiceData>; closeDialog: () => void }) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { data, setData, setSelectedIndex } = useAppContext();
  const [name, setName] = useState('');
  const nameValidationMessage = useValidateKey(name, data);
  const allInputsValid = !nameValidationMessage;
  const sanitizedKey = configKeySanitize(name);
  const sanitizeMessage: MessageData = { variant: 'info', message: t('message.sanitizedKey', { key: sanitizedKey }) };

  const addWebService = (event: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
    if (!allInputsValid) {
      return;
    }
    setData(old => [
      ...old,
      {
        key: sanitizedKey,
        name,
        description: '',
        icon: '',
        features: [],
        properties: [],
        codegen: { wsdlUrl: '', underscoreNames: false, namespaceMappings: {} },
        service: { serviceClass: '', ports: [{ name: '', locationUri: '', fallbackLocationUris: [] }] }
      }
    ]);
    if (!event.ctrlKey && !event.metaKey) {
      closeDialog();
    } else {
      setName('');
      nameInputRef.current?.focus();
    }
    selectRow(table, data.length.toString());
    setSelectedIndex(data.length);
  };

  const enter = useHotkeys<HTMLDivElement>(['Enter', 'mod+Enter'], addWebService, { scopes: DIALOG_HOTKEY_IDS, enableOnFormTags: true });

  return (
    <BasicDialogContent
      title={t('dialog.addWebService.title')}
      description={t('dialog.addWebService.desc')}
      submit={
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='primary'
                size='large'
                icon={IvyIcons.Plus}
                aria-label={t('dialog.create')}
                disabled={!allInputsValid}
                onClick={addWebService}
              >
                {t('dialog.create')}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('dialog.createTooltip', { modifier: hotkeyText('mod') })}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      }
      cancel={
        <Button variant='outline' size='large'>
          {t('common.label.cancel')}
        </Button>
      }
      ref={enter}
      tabIndex={-1}
    >
      <BasicField label={t('common.label.name')} message={nameValidationMessage || sanitizeMessage} aria-label={t('common.label.name')}>
        <Input ref={nameInputRef} value={name} onChange={event => setName(event.target.value)} />
      </BasicField>
    </BasicDialogContent>
  );
};
