import { Emitter } from '@axonivy/jsonrpc';
import type {
  EditorFileContent,
  ValidationResult,
  WebServiceActionArgs,
  WebServiceClient,
  WebServiceEditorData,
  WebServiceMetaRequestTypes,
  WebServiceSaveDataArgs
} from '@axonivy/webservice-editor-protocol';
import { data } from './data-mock';
import { META_FEATURES, META_PROPS } from './meta.mock';
import { validateMock } from './validation-mock';

export class WebServiceMock implements WebServiceClient {
  private webserviceData: WebServiceEditorData;
  constructor() {
    this.webserviceData = {
      context: { app: 'mockApp', pmv: 'mockPmv', file: 'webservice-clients.yaml' },
      data: data,
      helpUrl: 'https://dev.axonivy.com',
      readonly: false
    };
  }

  protected onValidationChangedEmitter = new Emitter<void>();
  onValidationChanged = this.onValidationChangedEmitter.event;
  protected onDataChangedEmitter = new Emitter<void>();
  onDataChanged = this.onDataChangedEmitter.event;

  initialize(): Promise<void> {
    return Promise.resolve();
  }

  data(): Promise<WebServiceEditorData> {
    return Promise.resolve(this.webserviceData);
  }

  saveData(saveData: WebServiceSaveDataArgs): Promise<EditorFileContent> {
    this.webserviceData.data = saveData.data;
    return Promise.resolve({ content: '' });
  }

  validate(): Promise<ValidationResult[]> {
    return Promise.resolve(validateMock(this.webserviceData.data));
  }

  meta<TMeta extends keyof WebServiceMetaRequestTypes>(
    path: TMeta,
    args: WebServiceMetaRequestTypes[TMeta][0]
  ): Promise<WebServiceMetaRequestTypes[TMeta][1]> {
    console.log('Meta:', args);
    switch (path) {
      case 'meta/properties/all':
        return Promise.resolve(META_PROPS);
      case 'meta/features/all':
        return Promise.resolve(META_FEATURES);
      default:
        throw Error('mock meta path not programmed');
    }
  }

  action(action: WebServiceActionArgs): void {
    console.log('action', JSON.stringify(action));
  }
}
