/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  type WebServiceContext,
  type WebServiceData,
  type WebServiceMetaRequestTypes,
  type ValidationResult
} from '@axonivy/webservice-editor-protocol';
import { ReadonlyProvider } from '@axonivy/ui-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook, type RenderHookOptions, type RenderOptions, type RenderResult } from '@testing-library/react';
import i18n from 'i18next';
import { type ReactElement, type ReactNode } from 'react';
import { initReactI18next } from 'react-i18next';
import { AppProvider } from '../context/AppContext';
import { ClientContextProvider, type ClientContext } from '../context/ClientContext';
import enMessages from '../translation/webservice-editor/en.json';

type ContextHelperProps = {
  appContext?: {
    context?: WebServiceContext;
    data?: Array<WebServiceData>;
    setData?: (data: Array<WebServiceData>) => void;
    validations?: Array<ValidationResult>;
    helpUrl?: string;
  };
  readonly?: boolean;
};

const initTranslation = () => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n.use(initReactI18next).init({
    supportedLngs: ['en'],
    fallbackLng: 'en',
    ns: ['webservice-editor'],
    defaultNS: 'webservice-editor',
    resources: {
      en: { 'webservice-editor': enMessages }
    }
  });
};

const ContextHelper = ({ appContext, readonly, children }: ContextHelperProps & { children: ReactNode }) => {
  const data = appContext?.data ?? ([] as Array<WebServiceData>);
  const client: ClientContext = {
    // @ts-ignore
    client: {
      meta<TMeta extends keyof WebServiceMetaRequestTypes>(path: TMeta): Promise<WebServiceMetaRequestTypes[TMeta][1]> {
        switch (path) {
          default:
            throw Error('mock meta path not programmed');
        }
      }
    }
  };
  const queryClient = new QueryClient();
  initTranslation();
  return (
    <ClientContextProvider client={client.client}>
      <QueryClientProvider client={queryClient}>
        <ReadonlyProvider readonly={readonly ?? false}>
          <AppProvider
            value={{
              context: appContext?.context ?? ({ file: '' } as WebServiceContext),
              data,
              // @ts-ignore
              setData: appContext?.setData ? getData => appContext.setData(getData(data)) : () => {},
              selectedIndex: -1,
              setSelectedIndex: () => {},
              history: { push: () => {}, undo: () => {}, redo: () => {}, canUndo: false, canRedo: false },
              validations: appContext?.validations ?? [],
              detail: false,
              setDetail: () => {},
              helpUrl: appContext?.helpUrl ?? ''
            }}
          >
            {children}
          </AppProvider>
        </ReadonlyProvider>
      </QueryClientProvider>
    </ClientContextProvider>
  );
};

export const customRenderHook = <Result, Props>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props> & { wrapperProps: ContextHelperProps }
) => {
  return renderHook(render, {
    wrapper: props => <ContextHelper {...props} {...options?.wrapperProps} />,
    ...options
  });
};

export const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { wrapperProps: ContextHelperProps }
): RenderResult => {
  return render(ui, { wrapper: props => <ContextHelper {...props} {...options?.wrapperProps} />, ...options });
};
