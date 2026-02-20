import type { WebServiceData } from '@axonivy/webservice-editor-protocol';
import { customRenderHook } from 'test-utils';
import { useValidateName } from './useValidateAddWebService';

const data: Array<WebServiceData> = [
  {
    name: 'Employee',
    description: '',
    icon: '',
    id: '1',
    uri: '',
    features: [],
    properties: [],
    openApi: {
      namespace: '',
      resolveFully: false,
      spec: ''
    }
  },
  {
    name: 'Teamleader',
    description: '',
    icon: '',
    id: '2',
    uri: '',
    features: [],
    properties: [],
    openApi: {
      namespace: '',
      resolveFully: false,
      spec: ''
    }
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
