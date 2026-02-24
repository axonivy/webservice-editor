import { BasicCollapsible, BasicField, BasicInput, Flex, PanelMessage, type MessageData } from '@axonivy/ui-components';
import type { Severity, ValidationResult, WebServiceData } from '@axonivy/webservice-editor-protocol';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useValidations } from '../../hooks/useValidation';
import { AuthenticationPart } from './AuthenticationPart';
import './DetailContent.css';
import { FeaturesTable } from './components/FeaturesTable';
import { NameInput } from './components/NameInput';
import { PropertiesTable } from './components/PropertiesTable';
import { Service } from './components/Service';

export const DetailContent = () => {
  const { t } = useTranslation();
  const { data, setData, selectedIndex } = useAppContext();
  const webservice = useMemo(() => data[selectedIndex], [data, selectedIndex]);
  const validations = useValidations(webservice?.name ?? '');
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

  const idMessage = fieldMessage(validations, webservice.name, 'id');
  const nameMessage = fieldMessage(validations, webservice.name, 'name');

  return (
    <Flex direction='column' gap={3} className='webservice-editor-detail-content'>
      <BasicCollapsible label={t('common.label.details')} defaultOpen>
        <Flex direction='column' gap={3}>
          <BasicField label={t('common.label.id')} message={idMessage}>
            <BasicInput value={webservice.id} disabled />
          </BasicField>
          <NameInput
            value={webservice.name}
            onChange={value => handleAttributeChange('name', value)}
            webServices={data.filter(u => u.name !== webservice.name)}
            message={nameMessage}
          />
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
        validationPath={webservice.name}
      />
      <PropertiesTable data={webservice.properties} onChange={change => handleAttributeChange('properties', change)} />
      <BasicCollapsible label={t('label.endpoint')}>
        <Service key={webservice.name} data={webservice.service} onChange={change => handleAttributeChange('service', change)} />
      </BasicCollapsible>
    </Flex>
  );
};

const fieldMessage = (validations: Array<ValidationResult>, webserviceName: string, field: keyof WebServiceData) =>
  validations
    .filter(v => v.path.startsWith(`${webserviceName}.${field}`))
    .map<MessageData>(v => ({ message: v.message, variant: v.severity.toLocaleLowerCase() as Lowercase<Severity> }))[0];
