import type { WebServiceData } from '@axonivy/webservice-editor-protocol';

export const data: Array<WebServiceData> = [
  {
    name: 'personService',
    id: 'e00c9735-7733-4da8-85c8-6413c6fb2cd3',
    uri: '{ivy.app.baseurl}/api/persons',
    description: '',
    icon: '',
    features: ['ch.ivyteam.ivy.rest.client.authentication.HttpBasicAuthenticationFeature', 'ch.ivyteam.ivy.rest.client.mapper.JsonFeature'],
    properties: [
      { key: 'username', type: 'STRING', value: 'theWorker' },
      { key: 'password', type: 'PASSWORD', value: 'theWorker' }
    ],
    openApi: {
      spec: '',
      namespace: '',
      resolveFully: false
    }
  },
  {
    name: 'batchService',
    id: 'b0a5f371-e479-444d-b71c-af1fff4c084d',
    uri: '{ivy.app.baseurl}/api/batch',
    description: '',
    icon: '',
    features: ['ch.ivyteam.ivy.rest.client.authentication.HttpBasicAuthenticationFeature'],
    properties: [
      { key: 'jersey.config.client.readTimeout', type: 'STRING', value: '35000' },
      { key: 'jersey.config.client.connectTimeout', type: 'STRING', value: '1000' },
      { key: 'username', type: 'STRING', value: 'theWorker' },
      { key: 'password', type: 'PASSWORD', value: 'theWorker' }
    ],
    openApi: {
      spec: '',
      namespace: '',
      resolveFully: false
    }
  },
  {
    name: 'jsonPlaceholder',
    id: '449e7581-aa1e-4e3b-931a-903253491b50',
    uri: 'https://jsonplaceholder.typicode.com/',
    description: 'A free to use test service with fixed data.',
    icon: '',
    features: ['ch.ivyteam.ivy.rest.client.mapper.JsonFeature'],
    properties: [{ key: 'JSON.Deserialization.FAIL_ON_UNKNOWN_PROPERTIES', type: 'STRING', value: 'false' }],
    openApi: {
      spec: '',
      namespace: '',
      resolveFully: false
    }
  },
  {
    name: 'odataService',
    id: '65f8e5a4-768d-4a68-813a-e6d569cda522',
    uri: 'https://services.odata.org/V4/(S(cnbm44wtbc1v5bgrlek5lpcc))/TripPinServiceRW',
    description: 'The OData demo service',
    icon: '',
    features: ['com.axonivy.connectivity.rest.sample.odata.TripPinJsonFeature'],
    properties: [{ key: 'JSON.Deserialization.FAIL_ON_UNKNOWN_PROPERTIES', type: 'STRING', value: 'false' }],
    openApi: {
      spec: '',
      namespace: '',
      resolveFully: false
    }
  },
  {
    name: 'ivy.engine (local.backend)',
    id: '4d9a8b09-9968-4476-a8ac-b71a94d25e94',
    uri: '{ivy.app.baseurl}/api',
    description:
      'A client using the REST endpoints defined by the serving ivy.engine. These endpoints either derive from application/projects or static engine resources.',
    icon: '',
    features: [
      'ch.ivyteam.ivy.rest.client.authentication.HttpBasicAuthenticationFeature',
      'org.glassfish.jersey.media.multipart.MultiPartFeature'
    ],
    properties: [
      { key: 'username', type: 'STRING', value: 'theWorker' },
      { key: 'password', type: 'PASSWORD', value: 'theWorker' }
    ],
    openApi: {
      spec: '',
      namespace: '',
      resolveFully: false
    }
  },
  {
    name: 'openApiService',
    id: 'ae69ba01-79b7-4dce-9049-900f8f420907',
    uri: 'https://petstore3.swagger.io/api/v3',
    description: '',
    icon: '',
    features: ['ch.ivyteam.ivy.rest.client.mapper.JsonFeature'],
    properties: [{ key: 'JSON.Deserialization.FAIL_ON_UNKNOWN_PROPERTIES', type: 'STRING', value: 'false' }],
    openApi: {
      spec: 'https://petstore3.swagger.io/api/v3/openapi.json',
      namespace: 'io.swagger.petstore.client',
      resolveFully: false
    }
  },
  {
    name: 'customClient',
    id: 'bf0e4baf-96e6-470c-a61c-a2f4dbfe4c8f',
    uri: '{ivy.app.baseurl}/api/persons',
    description: '',
    icon: '',
    features: [
      'ch.ivyteam.ivy.rest.client.authentication.HttpBasicAuthenticationFeature',
      'ch.ivyteam.ivy.rest.client.mapper.JsonFeature',
      'com.axonivy.connectivity.rest.client.connect.KeepAliveFeature'
    ],
    properties: [
      { key: 'username', type: 'STRING', value: 'theWorker' },
      { key: 'password', type: 'PASSWORD', value: 'theWorker' }
    ],
    openApi: {
      spec: '',
      namespace: '',
      resolveFully: false
    }
  }
];
