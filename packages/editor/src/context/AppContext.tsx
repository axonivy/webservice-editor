import { type useHistoryData } from '@axonivy/ui-components';
import { type WebServiceContext, type WebServiceData, type ValidationResult } from '@axonivy/webservice-editor-protocol';
import { createContext, useContext } from 'react';
import type { UpdateConsumer } from '../types/types';

export type AppContext = {
  data: Array<WebServiceData>;
  setData: UpdateConsumer<Array<WebServiceData>>;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  context: WebServiceContext;
  history: ReturnType<typeof useHistoryData<Array<WebServiceData>>>;
  validations: Array<ValidationResult>;
  detail: boolean;
  setDetail: (visible: boolean) => void;
  helpUrl: string;
};

export const appContext = createContext<AppContext>({
  data: [],
  setData: data => data,
  selectedIndex: -1,
  setSelectedIndex: () => {},
  context: { app: '', pmv: '', file: '' },
  history: { push: () => {}, undo: () => {}, redo: () => {}, canUndo: false, canRedo: false },
  validations: [],
  detail: true,
  setDetail: () => {},
  helpUrl: ''
});

export const AppProvider = appContext.Provider;

export const useAppContext = (): AppContext & { setUnhistoriedVariables: UpdateConsumer<Array<WebServiceData>> } => {
  const context = useContext(appContext);
  return {
    ...context,
    setData: updateData => {
      context.setData(old => {
        const newData = updateData(old);
        context.history.push(newData);
        return newData;
      });
    },
    setUnhistoriedVariables: context.setData
  };
};
