import { BasicCollapsible, BasicField, BasicInput, Flex, PanelMessage, type MessageData } from '@axonivy/ui-components';
import type { Severity, ValidationResult, WebServiceData } from '@axonivy/webservice-editor-protocol';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useValidations } from '../../hooks/useValidation';
import { AuthenticationPart } from './AuthenticationPart';
import { FeaturesTable } from './components/FeaturesTable';
import { PropertiesTable } from './components/PropertiesTable';
import { Service } from './components/Service';

export const DetailContent = () => {
  const { t } = useTranslation();
  const { data, setData, selectedIndex } = useAppContext();
  const webservice = useMemo(() => data[selectedIndex], [data, selectedIndex]);
  const validations = useValidations(webservice?.key ?? '');
  if (webservice === undefined) {
    return <PanelMessage message={t('label.noWebServiceSelected')} />;
  }
  const handleAttributeChange = <T extends keyof WebServiceData>(key: T, value: WebServiceData[T]) =>
    setData(old => {
      const oldWebservice = old[selectedIndex];
      if (oldWebservice) {
        oldWebservice[key] = value;
      }
      return structuredClone(old);
    });

  const keyMessage = fieldMessage(validations, webservice, 'key');

  return (
    <Flex direction='column' gap={3} className='min-h-0 overflow-auto p-3'>
      <BasicCollapsible label={t('common.label.details')} defaultOpen>
        <Flex direction='column' gap={3}>
          <BasicField label={t('common.label.key')} message={keyMessage}>
            <BasicInput value={webservice.key} disabled />
          </BasicField>
          <BasicField label={t('common.label.name')}>
            <BasicInput value={webservice.name} onChange={event => handleAttributeChange('name', event.target.value)} />
          </BasicField>
          <BasicField label={t('common.label.description')}>
            <BasicInput value={webservice.description} onChange={event => handleAttributeChange('description', event.target.value)} />
          </BasicField>
          <BasicField label={t('common.label.icon')}>
            <BasicInput value={webservice.icon} onChange={event => handleAttributeChange('icon', event.target.value)} />
          </BasicField>
        </Flex>
      </BasicCollapsible>
      <BasicCollapsible label={t('common.label.authentication')}>
        <AuthenticationPart webService={webservice} handleAttributeChange={handleAttributeChange} />
      </BasicCollapsible>
      <FeaturesTable
        data={webservice.features}
        onChange={change => handleAttributeChange('features', change)}
        validationPath={webservice.key}
      />
      <PropertiesTable data={webservice.properties} onChange={change => handleAttributeChange('properties', change)} />
      <BasicCollapsible label={t('label.endpoint')}>
        <Service key={selectedIndex} data={webservice.service} onChange={change => handleAttributeChange('service', change)} />
      </BasicCollapsible>
    </Flex>
  );
};

const fieldMessage = (validations: Array<ValidationResult>, webservice: WebServiceData, field: keyof WebServiceData) =>
  validations
    .filter(v => v.path.toLowerCase().startsWith(`${webservice.key}.${field}`.toLowerCase()))
    .map<MessageData>(v => ({ message: v.message, variant: v.severity.toLowerCase() as Lowercase<Severity> }))[0];
