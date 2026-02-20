import {
  BaseRpcClient,
  createMessageConnection,
  Emitter,
  urlBuilder,
  type Connection,
  type Disposable,
  type MessageConnection
} from '@axonivy/jsonrpc';
import type {
  EditorFileContent,
  Event,
  WebServiceActionArgs,
  WebServiceClient,
  WebServiceContext,
  WebServiceEditorData,
  WebServiceMetaRequestTypes,
  WebServiceNotificationTypes,
  WebServiceOnNotificationTypes,
  WebServiceRequestTypes,
  WebServiceSaveDataArgs,
  ValidationResult
} from '@axonivy/webservice-editor-protocol';

export class WebServiceClientJsonRpc extends BaseRpcClient implements WebServiceClient {
  protected onDataChangedEmitter = new Emitter<void>();
  protected onValidationChangedEmitter = new Emitter<void>();
  onDataChanged: Event<void> = this.onDataChangedEmitter.event;
  onValidationChanged: Event<void> = this.onValidationChangedEmitter.event;

  protected override setupConnection(): void {
    super.setupConnection();
    this.toDispose.push(this.onDataChangedEmitter);
    this.toDispose.push(this.onValidationChangedEmitter);
    this.onNotification('dataChanged', data => {
      this.onDataChangedEmitter.fire(data);
    });
    this.onNotification('validationChanged', data => {
      this.onValidationChangedEmitter.fire(data);
    });
  }

  initialize(context: WebServiceContext): Promise<void> {
    return this.sendRequest('initialize', { ...context });
  }

  data(context: WebServiceContext): Promise<WebServiceEditorData> {
    return this.sendRequest('data', { ...context });
  }

  saveData(saveData: WebServiceSaveDataArgs): Promise<EditorFileContent> {
    return this.sendRequest('saveData', { ...saveData });
  }

  validate(context: WebServiceContext): Promise<ValidationResult[]> {
    return this.sendRequest('validate', { ...context });
  }

  meta<TMeta extends keyof WebServiceMetaRequestTypes>(
    path: TMeta,
    args: WebServiceMetaRequestTypes[TMeta][0]
  ): Promise<WebServiceMetaRequestTypes[TMeta][1]> {
    return this.sendRequest(path, args);
  }

  action(action: WebServiceActionArgs): void {
    void this.sendNotification('action', action);
  }

  sendRequest<K extends keyof WebServiceRequestTypes>(command: K, args?: WebServiceRequestTypes[K][0]): Promise<WebServiceRequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  sendNotification<K extends keyof WebServiceNotificationTypes>(command: K, args: WebServiceNotificationTypes[K]): Promise<void> {
    return this.connection.sendNotification(command, args);
  }

  onNotification<K extends keyof WebServiceOnNotificationTypes>(kind: K, listener: (args: WebServiceOnNotificationTypes[K]) => unknown): Disposable {
    return this.connection.onNotification(kind, listener);
  }

  public static webSocketUrl(url: string) {
    return urlBuilder(url, 'ivy-webservice-lsp');
  }

  public static async startClient(connection: Connection): Promise<WebServiceClientJsonRpc> {
    return this.startMessageClient(createMessageConnection(connection.reader, connection.writer));
  }

  public static async startMessageClient(connection: MessageConnection): Promise<WebServiceClientJsonRpc> {
    const client = new WebServiceClientJsonRpc(connection);
    await client.start();
    return client;
  }
}
