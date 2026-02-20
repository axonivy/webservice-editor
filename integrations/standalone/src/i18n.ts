import { deMessages, enMessages } from '@axonivy/webservice-editor';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

export const initTranslation = () => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      debug: false,
      supportedLngs: ['en', 'de'],
      fallbackLng: 'en',
      ns: ['webservice-editor'],
      defaultNS: 'webservice-editor',
      resources: {
        en: { 'webservice-editor': enMessages },
        de: { 'webservice-editor': deMessages }
      },
      detection: {
        order: ['querystring']
      }
    });
};
