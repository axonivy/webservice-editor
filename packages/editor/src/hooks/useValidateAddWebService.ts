import type { WebServiceData } from '@axonivy/webservice-editor-protocol';
import type { MessageData } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useValidateName = (name: string, webServices: Array<WebServiceData>) => {
  const { t } = useTranslation();
  return useMemo<MessageData | undefined>(() => {
    switch (validateName(name, webServices)) {
      case 'emptyName':
        return toErrorMessage(t('message.emptyName'));
      case 'alreadyExists':
        return toErrorMessage(t('message.webserviceAlreadyExists'));
      default:
        return;
    }
  }, [name, webServices, t]);
};

export const validateName = (name: string, webServices: Array<WebServiceData>) => {
  const trimmedName = name.trim();
  if (trimmedName === '') {
    return 'emptyName';
  }
  if (webServices.map(webService => webService.name).includes(trimmedName)) {
    return 'alreadyExists';
  }
  return undefined;
};

const toErrorMessage = (message: string): MessageData => ({ message: message, variant: 'error' });
