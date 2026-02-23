import type { ValidationResult, WebServiceData } from '@axonivy/webservice-editor-protocol';
import { customRenderHook } from 'test-utils';
import { useValidations } from './useValidation';

test('useValidations', () => {
  expect(renderValidations('').result.current).toEqual([]);
  expect(renderValidations('Employee').result.current).toEqual([validations[0]]);
  expect(renderValidations('Teamleader').result.current).toEqual([validations[1], validations[2], validations[3]]);
  expect(renderValidations('Manager').result.current).toEqual([validations[4]]);
  expect(renderValidations('HR Manager').result.current).toEqual([]);
});

const renderValidations = (path: string) => {
  return customRenderHook(() => useValidations(path), { wrapperProps: { appContext: { data, validations } } });
};

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
  },
  {
    name: 'Manager',
    description: '',
    icon: '',
    id: '3',
    features: [],
    properties: [],
    codegen: { wsdlUrl: '', underscoreNames: false, namespaceMappings: {} },
    service: { serviceClass: '', ports: [{ name: '', locationUri: '', fallbackLocationUris: [] }] }
  },
  {
    name: 'HR Manager',
    description: '',
    icon: '',
    id: '4',
    features: [],
    properties: [],
    codegen: { wsdlUrl: '', underscoreNames: false, namespaceMappings: {} },
    service: { serviceClass: '', ports: [{ name: '', locationUri: '', fallbackLocationUris: [] }] }
  }
];

const validations: Array<ValidationResult> = [
  { message: 'message0', path: 'Employee.id', severity: 'INFO' },
  { message: 'message1', path: 'Teamleader.parent', severity: 'INFO' },
  { message: 'message2', path: 'Teamleader', severity: 'WARNING' },
  { message: 'message3', path: 'Teamleader', severity: 'ERROR' },
  { message: 'message4', path: 'Manager', severity: 'INFO' }
];
