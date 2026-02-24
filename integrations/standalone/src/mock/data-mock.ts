import type { WebServiceData } from '@axonivy/webservice-editor-protocol';

export const data: Array<WebServiceData> = [
  {
    name: 'personService',
    id: '16150E44A158D09C',
    description: '',
    icon: '',
    features: ['ch.ivyteam.ivy.webservice.exec.cxf.feature.HttpBasicAuthenticationFeature'],
    properties: [
      { key: 'username', type: 'STRING', value: 'theBoss' },
      { key: 'password', type: 'PASSWORD', value: 'theBoss' }
    ],
    codegen: {
      wsdlUrl: 'http://127.0.0.1:8081/designer/ws/connectivity-demos/16150E1D07E8CA18?WSDL',
      underscoreNames: false,
      namespaceMappings: {}
    },
    service: {
      serviceClass: 'com.axonivy.connectivity.soap.service.client.PersonServiceService',
      ports: [
        { name: 'PersonServicePort', locationUri: '{ivy.app.baseurl}/ws/connectivity-demos/16150E1D07E8CA18', fallbackLocationUris: [] }
      ]
    }
  },
  {
    name: 'technicalBackend',
    id: '162B962523BAAB85',
    description: '',
    icon: '',
    features: [],
    properties: [],
    codegen: {
      wsdlUrl: 'http://localhost:8081/designer/ws/connectivity-demos/162B95BB70C3178E?WSDL',
      underscoreNames: false,
      namespaceMappings: {}
    },
    service: {
      serviceClass: 'com.axonivy.connectivity.client.TechnicalBackendServiceService',
      ports: [
        {
          name: 'TechnicalBackendServicePort',
          locationUri: '{ivy.app.baseurl}/ws/connectivity-demos/162B95BB70C3178E',
          fallbackLocationUris: []
        }
      ]
    }
  },
  {
    name: 'smartbearTests',
    id: '162B97C859B22CA3',
    description: '',
    icon: '',
    features: [],
    properties: [],
    codegen: {
      wsdlUrl: 'http://secure.smartbearsoftware.com/samples/testcomplete12/webservices/Service.asmx?WSDL',
      underscoreNames: false,
      namespaceMappings: {}
    },
    service: {
      serviceClass: 'com.smartbear.sample.test.client.SampleWebService',
      ports: [
        {
          name: 'SampleWebServiceSoap',
          locationUri: 'http://secure.smartbearsoftware.com/samples/testcomplete12/webservices/Service.asmx',
          fallbackLocationUris: []
        },
        {
          name: 'SampleWebServiceSoap12',
          locationUri: 'http://www.axonivy.com',
          fallbackLocationUris: []
        }
      ]
    }
  },
  {
    name: 'interceptedService',
    id: '16D2A643A3A25C52',
    description: '',
    icon: '',
    features: [],
    properties: [],
    codegen: {
      wsdlUrl: 'http://localhost:8081/designer/ws/connectivity-demos/16D29AE50A7A6E34?WSDL',
      underscoreNames: false,
      namespaceMappings: {}
    },
    service: {
      serviceClass: 'com.axonivy.connectivity.soap.interceptor.client.ServiceWithExceptionService',
      ports: [
        {
          name: 'ServiceWithExceptionPort',
          locationUri: '{ivy.app.baseurl}/ws/connectivity-demos/16D29AE50A7A6E34',
          fallbackLocationUris: []
        }
      ]
    }
  },
  {
    name: 'interceptedPersonService',
    id: '16330E44A158D09C',
    description: '',
    icon: '',
    features: [
      'ch.ivyteam.ivy.webservice.exec.cxf.feature.HttpBasicAuthenticationFeature',
      'com.axonivy.connectivity.soap.client.CustomLogFeature'
    ],
    properties: [
      { key: 'username', type: 'STRING', value: 'theBoss' },
      { key: 'password', type: 'PASSWORD', value: 'theBoss' }
    ],
    codegen: {
      wsdlUrl: 'http://127.0.0.1:8081/designer/ws/connectivity-demos/16150E1D07E8CA18?WSDL',
      underscoreNames: false,
      namespaceMappings: {}
    },
    service: {
      serviceClass: 'soap.intercepted.client.person.ivyteam.ch.client.PersonServiceService',
      ports: [
        { name: 'PersonServicePort', locationUri: '{ivy.app.baseurl}/ws/connectivity-demos/16150E1D07E8CA18', fallbackLocationUris: [] }
      ]
    }
  }
];
