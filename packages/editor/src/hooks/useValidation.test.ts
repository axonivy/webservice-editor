import type { WebServiceData, ValidationResult } from '@axonivy/webservice-editor-protocol';
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
    uri: '',
    features: [],
    openApi: { namespace: '', spec: '', resolveFully: false },
    properties: []
  },
  {
    name: 'Teamleader',
    description: '',
    icon: '',
    id: '2',
    uri: '',
    features: [],
    openApi: { namespace: '', spec: '', resolveFully: false },
    properties: []
  },
  {
    name: 'Manager',
    description: '',
    icon: '',
    id: '3',
    uri: '',
    features: [],
    openApi: { namespace: '', spec: '', resolveFully: false },
    properties: []
  },
  {
    name: 'HR Manager',
    description: '',
    icon: '',
    id: '4',
    uri: '',
    features: [],
    openApi: { namespace: '', spec: '', resolveFully: false },
    properties: []
  }
];

const validations: Array<ValidationResult> = [
  { message: 'message0', path: 'Employee.id', severity: 'INFO' },
  { message: 'message1', path: 'Teamleader.parent', severity: 'INFO' },
  { message: 'message2', path: 'Teamleader', severity: 'WARNING' },
  { message: 'message3', path: 'Teamleader', severity: 'ERROR' },
  { message: 'message4', path: 'Manager', severity: 'INFO' }
];
