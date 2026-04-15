import { BasicCollapsible, BasicField, BasicInput, Combobox, Flex, PanelMessage, type MessageData } from '@axonivy/ui-components';
import type { Severity, ValidationResult, WebServiceData } from '@axonivy/webservice-editor-protocol';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useMeta } from '../../hooks/useMeta';
import { useValidations } from '../../hooks/useValidation';
import { AuthenticationPart } from './AuthenticationPart';
import { FeaturesTable } from './components/FeaturesTable';
import { PropertiesTable } from './components/PropertiesTable';
import { Service } from './components/Service';

export const DetailContent = () => {
  const { t } = useTranslation();
  const { data, setData, selectedIndex, context } = useAppContext();
  const webservice = useMemo(() => data[selectedIndex], [data, selectedIndex]);
  const validations = useValidations(webservice?.key ?? '');
  const iconMeta = useMeta('meta/icons/all', context);
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
  const iconOptions = iconMeta.data?.map(icon => ({ icon: icon.path, label: icon.name, value: icon.relativePath })) ?? [];

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
            <Flex alignItems='center' gap={2} className='w-full *:last:grow'>
              <div className='flex size-9.25 items-center justify-center rounded-sm border border-n200'>
                {webservice.icon && <img src={iconOptions.find(option => option.value === webservice.icon)?.icon} className='size-6' />}
              </div>
              <Combobox
                itemRender={item => (
                  <Flex alignItems='center' gap={1}>
                    <img src={item.icon} className='size-3' />
                    <span>{item.label}</span>
                  </Flex>
                )}
                onChange={value => handleAttributeChange('icon', value)}
                options={iconOptions}
                value={webservice.icon}
              />
            </Flex>
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
