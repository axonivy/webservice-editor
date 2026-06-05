/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type {
  EditorFileContent,
  JavaType,
  LoadWsdlRequest,
  ValidationResult,
  WebServiceContext,
  WebServiceEditorData,
  WebServiceIcon,
  WebServiceSaveDataArgs,
  WsCodegenOpts,
  WsdlSpec,
  WsPropertyMeta
} from './data/webservice';

export interface WebServiceActionArgs {
  actionId: 'openUrl' | 'generateCxfClient';
  context: WebServiceContext;
  payload: string | WsGeneratorConfig;
}

export interface WsGeneratorConfig extends WsCodegenOpts {
  clientName: string;
}

export interface WebServiceMetaRequestTypes {
  'meta/properties/all': [void, Array<WsPropertyMeta>];
  'meta/features/all': [WebServiceContext, Array<JavaType>];
  'meta/icons/all': [WebServiceContext, Array<WebServiceIcon>];
  'meta/wsdl/load': [LoadWsdlRequest, WsdlSpec];
}

export interface WebServiceRequestTypes extends WebServiceMetaRequestTypes {
  initialize: [WebServiceContext, void];
  data: [WebServiceContext, WebServiceEditorData];
  saveData: [WebServiceSaveDataArgs, EditorFileContent];

  validate: [WebServiceContext, ValidationResult[]];
}

export interface WebServiceNotificationTypes {
  action: WebServiceActionArgs;
}

export interface WebServiceOnNotificationTypes {
  dataChanged: void;
  validationChanged: void;
}
