import type { ValidationResult, WebServiceData } from '@axonivy/webservice-editor-protocol';

export const validateMock = (data: Array<WebServiceData>): Array<ValidationResult> => {
  const validations: Array<ValidationResult> = [];
  data.forEach(webService => {
    if (webService.key.includes('invalid-')) {
      validations.push(
        {
          path: `${webService.key}.key`,
          message: `WebService ${webService.key} contains invalid characters`,
          severity: 'ERROR',
          code: 'WS-001',
          url: 'https://dev.axonivy.com/docs/validation/WS-001'
        },
        {
          path: `${webService.key}.uri`,
          message: 'URI empty',
          severity: 'ERROR',
          code: 'WS-002',
          url: ''
        },
        {
          path: `${webService.key}.features.bla`,
          message: 'Features unknown',
          severity: 'WARNING',
          code: 'WS-003',
          url: ''
        }
      );
    }
  });
  return validations;
};
