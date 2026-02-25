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
  Message,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useDialogHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filePath, setFilePath] = useState('');
  const [namespace, setNamespace] = useState('');
  const [underscoreNames, setUnderscoreNames] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFilePath(file.name);
    }
  };

  const generate = () => {
    const currentClient = data[selectedIndex];
    if (!currentClient) {
      return;
    }

    setData(currentData =>
      currentData.map((client, index) =>
        index === selectedIndex
          ? {
              ...client,
              codegen: {
                wsdlUrl: filePath,
                namespaceMappings: {},
                underscoreNames
              }
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
          disabled={true}
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
        <Message variant='warning' message={t('dialog.generateService.notYetImplemented')} />
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
          <BasicInput value={filePath} required onChange={event => setFilePath(event.target.value)} />
        </BasicField>
        <BasicField label={t('common.label.namespace')}>
          <BasicInput disabled={!filePath} value={namespace} required onChange={event => setNamespace(event.target.value)} />
        </BasicField>
        <BasicCheckbox
          disabled={!filePath}
          checked={underscoreNames}
          onCheckedChange={checked => setUnderscoreNames(checked === true)}
          label={t('dialog.generateService.underscoreOption')}
        />
      </Flex>
    </BasicDialogContent>
  );
};
