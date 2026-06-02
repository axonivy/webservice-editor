import { namespaceToJavaPackage } from './GenerateServiceDialog';

test('converts plain namespace to reversed java package and appends client', () => {
  expect(namespaceToJavaPackage('ws.test.ivyteam.ch')).toBe('ch.ivyteam.test.ws.client');
});

test('strips urn scheme before converting', () => {
  expect(namespaceToJavaPackage('urn:ws.test.ivyteam.ch')).toBe('ch.ivyteam.test.ws.client');
});

test('strips url scheme and trailing slash before converting', () => {
  expect(namespaceToJavaPackage('http://ws.test.ivyteam.ch/')).toBe('ch.ivyteam.test.ws.client');
});

test('returns empty string for empty input', () => {
  expect(namespaceToJavaPackage('')).toBe('');
  expect(namespaceToJavaPackage('   ')).toBe('');
});
