/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type {
  EditorFileContent,
  JavaType,
  ValidationResult,
  WebServiceContext,
  WebServiceEditorData,
  WebServicePropertyMeta,
  WebServiceSaveDataArgs
} from './data/webservice';

export interface WebServiceActionArgs {
  actionId: 'openUrl';
  context: WebServiceContext;
  payload: string;
}

export interface WebServiceMetaRequestTypes {
  'meta/properties/all': [void, Array<WebServicePropertyMeta>];
  'meta/features/all': [WebServiceContext, Array<JavaType>];
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
