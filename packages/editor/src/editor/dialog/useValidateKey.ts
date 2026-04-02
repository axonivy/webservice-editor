import { configKeySanitize, type MessageData } from '@axonivy/ui-components';
import type { WebServiceData } from '@axonivy/webservice-editor-protocol';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useValidateKey = (key: string, webServices: Array<WebServiceData>) => {
  const { t } = useTranslation();
  return useMemo<MessageData | undefined>(() => {
    switch (validateKey(key, webServices)) {
      case 'empty':
        return toErrorMessage(t('message.emptyName'));
      case 'alreadyExists':
        return toErrorMessage(t('message.webserviceAlreadyExists'));
      default:
        return;
    }
  }, [key, webServices, t]);
};

const validateKey = (key: string, webServices: Array<WebServiceData>) => {
  const sanitizedKey = configKeySanitize(key);
  if (sanitizedKey === '') {
    return 'empty';
  }
  if (webServices.map(webService => webService.key.toLowerCase()).includes(sanitizedKey.toLowerCase())) {
    return 'alreadyExists';
  }
};

const toErrorMessage = (message: string): MessageData => ({ message: message, variant: 'error' });
