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
  actionId: 'openUrl';
  context: WebServiceContext;
  payload: string;
}

export interface WsGeneratorConfig extends WsCodegenOpts {
  context: WebServiceContext;
  clientName: string;
}

export interface WsInfo {
  service: string;
  ports: Record<string, string>;
}

export interface WsGeneratorResult extends WsInfo {
  success: boolean;
  message: string;
}

export interface FilePickRequest {
  context: WebServiceContext;
  fileTypes: Record<string, string[]>;
}

export interface WebServiceMetaRequestTypes {
  'meta/properties/all': [void, Array<WsPropertyMeta>];
  'meta/features/all': [WebServiceContext, Array<JavaType>];
  'meta/icons/all': [WebServiceContext, Array<WebServiceIcon>];
  'meta/wsdl/load': [LoadWsdlRequest, WsdlSpec];
}

export interface WebServiceVscExtensionTypes {
  'integration/generate': [WsGeneratorConfig, WsGeneratorResult];
  'integration/file/pick': [FilePickRequest, string | undefined];
}

export interface WebServiceRequestTypes extends WebServiceMetaRequestTypes, WebServiceVscExtensionTypes {
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
