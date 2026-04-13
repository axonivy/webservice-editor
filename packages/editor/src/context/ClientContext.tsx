import type { WebServiceClient } from '@axonivy/webservice-editor-protocol';
import type { ReactNode } from 'react';
import { createContext, use } from 'react';

export interface ClientContext {
  client: WebServiceClient;
}

const ClientContext = createContext<ClientContext | undefined>(undefined);
export const useClient = (): WebServiceClient => {
  const context = use(ClientContext);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientContext');
  }
  return context.client;
};

export const ClientContextProvider = ({ client, children }: { client: WebServiceClient; children: ReactNode }) => {
  return <ClientContext value={{ client }}>{children}</ClientContext>;
};
