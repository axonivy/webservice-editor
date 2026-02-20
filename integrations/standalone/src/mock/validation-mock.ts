import type { WebServiceData, ValidationResult } from '@axonivy/webservice-editor-protocol';

export const validateMock = (data: Array<WebServiceData>): Array<ValidationResult> => {
  const validations: Array<ValidationResult> = [];
  data.forEach(webService => {
    if (webService.name.includes('#')) {
      validations.push(
        {
          path: `${webService.name}.name`,
          message: `WebService ${webService.name} contains invalid characters`,
          severity: 'ERROR'
        },
        {
          path: `${webService.name}.uri`,
          message: 'URI empty',
          severity: 'ERROR'
        },
        {
          path: `${webService.name}.features.bla`,
          message: 'Features unknown',
          severity: 'WARNING'
        }
      );
    }
  });
  return validations;
};
