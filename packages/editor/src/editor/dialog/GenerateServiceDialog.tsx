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
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useDialogHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { WsCodegenOpts } from '@axonivy/webservice-editor-protocol';
import { useMutation } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useClient } from '../../context/ClientContext';
import { useMeta } from '../../hooks/useMeta';

const DIALOG_HOTKEY_IDS = ['generateServiceDialog'];

export const namespaceToJavaPackage = (value: string) => {
  const withoutScheme = value.replace(/^[a-z][a-z0-9+.-]*:(?:\/\/)?/i, '').trim();
  if (!withoutScheme) {
    return '';
  }
  const packageName = withoutScheme
    .replace(/\/$/, '')
    .split('.')
    .map(part => part.trim())
    .filter(Boolean)
    .reverse()
    .join('.');
  return `${packageName}.client`;
};

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
        <GenerateDialogContent closeDialog={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

const GenerateDialogContent = ({ closeDialog }: { closeDialog: () => void }) => {
  const { t } = useTranslation();
  const { data, setData, selectedIndex, context } = useAppContext();
  const client = useClient();
  const selectedClient = data[selectedIndex];
  const initCodegen: WsCodegenOpts = selectedClient?.codegen ?? {
    wsdlUrl: '',
    namespace: '',
    underscoreNames: false
  };
  const [codegen, setCodegen] = useState<WsCodegenOpts>(initCodegen);
  const wsdlSpec = useMeta('meta/wsdl/load', { context, wsdlResource: codegen.wsdlUrl }, { disable: !codegen.wsdlUrl });
  const selectedNamespace = namespaceToJavaPackage(wsdlSpec.data?.namespaces?.[0] ?? '');
  const generateMutation = useMutation({
    mutationFn: (payload: { clientName: string; wsCodegen: WsCodegenOpts }) =>
      client.vsc('integration/generate', {
        context,
        clientName: payload.clientName,
        ...payload.wsCodegen
      }),
    onSuccess: (result, payload) => {
      if (!result.success) {
        return;
      }
      setData(currentData =>
        currentData.map((clientData, index) =>
          index === selectedIndex
            ? {
                ...clientData,
                codegen: payload.wsCodegen,
                service: {
                  serviceClass: result.service,
                  ports: Object.entries(result.ports).map(([name, locationUri]) => ({
                    name,
                    locationUri,
                    fallbackLocationUris: []
                  }))
                }
              }
            : clientData
        )
      );
      closeDialog();
    }
  });

  const browseWsdl = async () => {
    const selectedPath = await client.vsc('integration/file/pick', { context, fileTypes: { WebService: ['wsdl', 'xml'] } });
    if (selectedPath) {
      setCodegen(prev => ({ ...prev, wsdlUrl: selectedPath }));
    }
  };

  const generate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const currentClient = data[selectedIndex];
    if (!currentClient || !codegen.wsdlUrl) {
      return;
    }

    const wsCodegen = {
      ...codegen,
      namespace: codegen.namespace.trim() ? codegen.namespace : selectedNamespace
    };

    generateMutation.mutate({
      clientName: currentClient.name,
      wsCodegen
    });
  };

  return (
    <BasicDialogContent
      title={t('dialog.generateService.title')}
      description={t('dialog.generateService.desc')}
      submit={
        <Button
          type='button'
          variant='primary'
          size='large'
          disabled={!wsdlSpec.data?.namespaces?.length || generateMutation.isPending}
          icon={generateMutation.isPending ? IvyIcons.Spinner : IvyIcons.SettingsCog}
          spin={generateMutation.isPending}
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
              onClick={browseWsdl}
              title={t('common.label.browse')}
              aria-label={t('common.label.browse')}
            />
          }
          label={t('dialog.generateService.wsdlUri')}
          message={wsdlSpec.isError ? { variant: 'error', message: wsdlSpec.error.message } : undefined}
        >
          <BasicInput value={codegen.wsdlUrl} required onChange={event => setCodegen(prev => ({ ...prev, wsdlUrl: event.target.value }))} />
        </BasicField>
        {codegen.wsdlUrl && wsdlSpec.isPending && (
          <Flex direction='row' gap={1}>
            <Spinner size='small' />
            {t('common.label.loading')}
          </Flex>
        )}
        <BasicField label={t('common.label.namespace')}>
          <BasicInput
            disabled={!codegen.wsdlUrl}
            value={codegen.namespace}
            placeholder={selectedNamespace}
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
