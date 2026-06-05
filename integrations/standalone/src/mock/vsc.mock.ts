import type { WsGeneratorResult } from '@axonivy/webservice-editor-protocol';

export const VSC_GENERATE_RESULT = {
  success: true,
  message: 'Mock client generation completed',
  service: 'ch.ivyteam.test.ws.IvyEchoService',
  ports: {
    IvyEchoServiceHttpsSoap11Endpoint:
      'https://test-webservices.ivyteam.io:8443/axis2/services/IvyEchoService.IvyEchoServiceHttpsSoap11Endpoint/',
    IvyEchoServiceHttpEndpoint: 'http://test-webservices.ivyteam.io:8080/axis2/services/IvyEchoService.IvyEchoServiceHttpEndpoint/',
    IvyEchoServiceHttpsSoap12Endpoint:
      'https://test-webservices.ivyteam.io:8443/axis2/services/IvyEchoService.IvyEchoServiceHttpsSoap12Endpoint/',
    IvyEchoServiceHttpSoap12Endpoint:
      'http://test-webservices.ivyteam.io:8080/axis2/services/IvyEchoService.IvyEchoServiceHttpSoap12Endpoint/',
    IvyEchoServiceHttpsEndpoint: 'https://test-webservices.ivyteam.io:8443/axis2/services/IvyEchoService.IvyEchoServiceHttpsEndpoint/',
    IvyEchoServiceHttpSoap11Endpoint:
      'http://test-webservices.ivyteam.io:8080/axis2/services/IvyEchoService.IvyEchoServiceHttpSoap11Endpoint/'
  }
} as const satisfies WsGeneratorResult;
