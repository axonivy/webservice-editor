import type { ValidationResult, WebServiceData } from '@axonivy/webservice-editor-protocol';

export const validateMock = (data: Array<WebServiceData>): Array<ValidationResult> => {
  const validations: Array<ValidationResult> = [];
  data.forEach(webService => {
    if (webService.key.includes('invalid-')) {
      validations.push(
        {
          path: `${webService.key}.key`,
          message: `WebService ${webService.key} contains invalid characters`,
          severity: 'ERROR'
        },
        {
          path: `${webService.key}.uri`,
          message: 'URI empty',
          severity: 'ERROR'
        },
        {
          path: `${webService.key}.features.bla`,
          message: 'Features unknown',
          severity: 'WARNING'
        }
      );
    }
  });
  return validations;
};
