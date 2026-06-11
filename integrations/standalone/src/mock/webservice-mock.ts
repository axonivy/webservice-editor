import { Emitter } from '@axonivy/jsonrpc';
import type {
  EditorFileContent,
  ValidationResult,
  WebServiceActionArgs,
  WebServiceClient,
  WebServiceEditorData,
  WebServiceMetaRequestTypes,
  WebServiceSaveDataArgs,
  WebServiceVscExtensionTypes
} from '@axonivy/webservice-editor-protocol';
import { data } from './data-mock';
import { META_FEATURES, META_ICONS, META_PROPS, META_WSDL_SPEC } from './meta.mock';
import { validateMock } from './validation-mock';
import { VSC_GENERATE_RESULT } from './vsc.mock';

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
      case 'meta/icons/all':
        return Promise.resolve(META_ICONS);
      case 'meta/wsdl/load':
        return Promise.resolve(META_WSDL_SPEC);
      default:
        throw Error('mock meta path not programmed');
    }
  }

  vsc<TVsc extends keyof WebServiceVscExtensionTypes>(
    path: TVsc,
    args: WebServiceVscExtensionTypes[TVsc][0]
  ): Promise<WebServiceVscExtensionTypes[TVsc][1]> {
    console.log('Vsc:', JSON.stringify(args));
    switch (path) {
      case 'integration/generate': {
        const generateArgs = args as WebServiceVscExtensionTypes['integration/generate'][0];
        return new Promise<WebServiceVscExtensionTypes[TVsc][1]>(resolve => {
          setTimeout(() => {
            resolve({
              ...VSC_GENERATE_RESULT,
              message: `Generated ${generateArgs.clientName}.`
            } as WebServiceVscExtensionTypes[TVsc][1]);
          }, 500);
        });
      }
      case 'integration/file/pick':
        return Promise.resolve('/workspace/mock/service.wsdl') as Promise<WebServiceVscExtensionTypes[TVsc][1]>;
      default:
        throw Error('mock vsc path not programmed');
    }
  }

  action(action: WebServiceActionArgs): void {
    console.log('action', JSON.stringify(action));
  }
}
