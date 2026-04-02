import type { WebServiceData } from '@axonivy/webservice-editor-protocol';
import { customRenderHook } from 'test-utils';
import { useValidateKey } from './useValidateKey';

const data: Array<WebServiceData> = [
  {
    name: 'Employee',
    description: '',
    icon: '',
    key: 'Employee',
    features: [],
    properties: [],
    codegen: { wsdlUrl: '', underscoreNames: false, namespaceMappings: {} },
    service: { serviceClass: '', ports: [{ name: '', locationUri: '', fallbackLocationUris: [] }] }
  },
  {
    name: 'Teamleader',
    description: '',
    icon: '',
    key: 'Teamleader',
    features: [],
    properties: [],
    codegen: { wsdlUrl: '', underscoreNames: false, namespaceMappings: {} },
    service: { serviceClass: '', ports: [{ name: '', locationUri: '', fallbackLocationUris: [] }] }
  }
];

const validate = (key: string) => {
  const { result } = customRenderHook(() => useValidateKey(key, data));
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
