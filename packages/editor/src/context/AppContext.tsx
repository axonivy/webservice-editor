import { type useHistoryData } from '@axonivy/ui-components';
import { type ValidationResult, type WebServiceContext, type WebServiceData } from '@axonivy/webservice-editor-protocol';
import { createContext, use } from 'react';
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

export const AppContext = createContext<AppContext>({
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

export const AppProvider = AppContext.Provider;

export const useAppContext = (): AppContext & { setUnhistoriedVariables: UpdateConsumer<Array<WebServiceData>> } => {
  const context = use(AppContext);
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
