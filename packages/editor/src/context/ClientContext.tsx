import type { WebServiceClient } from '@axonivy/webservice-editor-protocol';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

export interface ClientContext {
  client: WebServiceClient;
}

const ClientContextInstance = createContext<ClientContext | undefined>(undefined);
export const useClient = (): WebServiceClient => {
  const context = useContext(ClientContextInstance);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientContext');
  }
  return context.client;
};

export const ClientContextProvider = ({ client, children }: { client: WebServiceClient; children: ReactNode }) => {
  return <ClientContextInstance.Provider value={{ client }}>{children}</ClientContextInstance.Provider>;
};
