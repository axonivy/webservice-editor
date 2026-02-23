import type { WebServiceData } from '@axonivy/webservice-editor-protocol';
import { customRenderHook } from 'test-utils';
import { useValidateName } from './useValidateAddWebService';

const data: Array<WebServiceData> = [
  {
    name: 'Employee',
    description: '',
    icon: '',
    id: '1',
    features: [],
    properties: [],
    codegen: { wsdlUrl: '', underscoreNames: false, namespaceMappings: {} },
    service: { serviceClass: '', ports: [{ name: '', locationUri: '', fallbackLocationUris: [] }] }
  },
  {
    name: 'Teamleader',
    description: '',
    icon: '',
    id: '2',
    features: [],
    properties: [],
    codegen: { wsdlUrl: '', underscoreNames: false, namespaceMappings: {} },
    service: { serviceClass: '', ports: [{ name: '', locationUri: '', fallbackLocationUris: [] }] }
  }
];

const validate = (name: string) => {
  const { result } = customRenderHook(() => useValidateName(name, data));
  return result.current;
};

test('validate', () => {
  expect(validate('Name')).toBeUndefined();
  const emptyError = { message: 'Name cannot be empty.', variant: 'error' };
  expect(validate('')).toEqual(emptyError);
  expect(validate('   ')).toEqual(emptyError);
  const alreadyExistError = { message: 'Web Service already exists.', variant: 'error' };
  expect(validate('Employee')).toEqual(alreadyExistError);
  expect(validate('Teamleader    ')).toEqual(alreadyExistError);
});
