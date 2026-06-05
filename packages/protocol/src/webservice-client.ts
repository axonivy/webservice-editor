import type {
  EditorFileContent,
  ValidationResult,
  WebServiceContext,
  WebServiceEditorData,
  WebServiceSaveDataArgs
} from './data/webservice';
import type { WebServiceActionArgs, WebServiceMetaRequestTypes, WebServiceVscExtensionTypes } from './webservice-protocol';

export interface Event<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export interface Disposable {
  dispose(): void;
}

export interface WebServiceClient {
  initialize(context: WebServiceContext): Promise<void>;
  data(context: WebServiceContext): Promise<WebServiceEditorData>;
  saveData(saveData: WebServiceSaveDataArgs): Promise<EditorFileContent>;

  meta<TMeta extends keyof WebServiceMetaRequestTypes>(
    path: TMeta,
    args: WebServiceMetaRequestTypes[TMeta][0]
  ): Promise<WebServiceMetaRequestTypes[TMeta][1]>;

  vsc<TVsc extends keyof WebServiceVscExtensionTypes>(
    path: TVsc,
    args: WebServiceVscExtensionTypes[TVsc][0]
  ): Promise<WebServiceVscExtensionTypes[TVsc][1]>;

  validate(context: WebServiceContext): Promise<ValidationResult[]>;
  action(action: WebServiceActionArgs): void;

  onDataChanged: Event<void>;
  onValidationChanged: Event<void>;
}
