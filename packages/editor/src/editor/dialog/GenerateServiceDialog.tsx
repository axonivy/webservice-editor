import {
  BasicCheckbox,
  BasicDialogContent,
  BasicField,
  BasicInput,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Flex,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useDialogHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { WsCodegenOpts } from '@axonivy/webservice-editor-protocol';
import { useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useAction } from '../../hooks/useAction';

const DIALOG_HOTKEY_IDS = ['generateServiceDialog'];

export const GenerateServiceDialog = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const { open, onOpenChange } = useDialogHotkeys(DIALOG_HOTKEY_IDS);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>{children}</DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{t('dialog.generateService.title')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent onCloseAutoFocus={e => e.preventDefault()}>
        <GenerateDialogContent />
      </DialogContent>
    </Dialog>
  );
};

const GenerateDialogContent = () => {
  const { t } = useTranslation();
  const { data, setData, selectedIndex } = useAppContext();
  const generateCxfClient = useAction('generateCxfClient');
  const selectedClient = data[selectedIndex];
  const initCodegen: WsCodegenOpts = selectedClient?.codegen ?? {
    wsdlUrl: '',
    namespace: '',
    underscoreNames: false
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [codegen, setCodegen] = useState<WsCodegenOpts>(initCodegen);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCodegen(prev => ({ ...prev, wsdlUrl: file.name }));
    }
  };

  const generate = () => {
    const currentClient = data[selectedIndex];
    if (!currentClient || !codegen.wsdlUrl) {
      return;
    }

    generateCxfClient({
      clientName: currentClient.name,
      ...codegen
    });

    setData(currentData =>
      currentData.map((client, index) =>
        index === selectedIndex
          ? {
              ...client,
              codegen
            }
          : client
      )
    );
  };

  return (
    <BasicDialogContent
      title={t('dialog.generateService.title')}
      description={t('dialog.generateService.desc')}
      submit={
        <Button
          variant='primary'
          size='large'
          disabled={!codegen.wsdlUrl.trim()}
          icon={IvyIcons.SettingsCog}
          aria-label={t('common.label.generate')}
          onClick={generate}
        >
          {t('common.label.generate')}
        </Button>
      }
      cancel={
        <Button variant='outline' size='large'>
          {t('common.label.cancel')}
        </Button>
      }
      tabIndex={-1}
    >
      <Flex direction='column' gap={2}>
        <BasicField
          control={
            <Button
              icon={IvyIcons.FolderOpen}
              onClick={() => fileInputRef.current?.click()}
              title={t('common.label.browse')}
              aria-label={t('common.label.browse')}
            />
          }
          label={t('dialog.generateService.wsdlUri')}
        >
          <input ref={fileInputRef} accept='.wsdl,.xml' type='file' onChange={handleFileChange} hidden />
          <BasicInput value={codegen.wsdlUrl} required onChange={event => setCodegen(prev => ({ ...prev, wsdlUrl: event.target.value }))} />
        </BasicField>
        <BasicField label={t('common.label.namespace')}>
          <BasicInput
            disabled={!codegen.wsdlUrl}
            value={codegen.namespace}
            required
            onChange={event => {
              setCodegen(prev => ({
                ...prev,
                namespace: event.target.value
              }));
            }}
          />
        </BasicField>
        <BasicCheckbox
          disabled={!codegen.wsdlUrl}
          checked={codegen.underscoreNames}
          onCheckedChange={checked => setCodegen(prev => ({ ...prev, underscoreNames: checked === true }))}
          label={t('dialog.generateService.underscoreOption')}
        />
      </Flex>
    </BasicDialogContent>
  );
};
