import type { WebServiceData } from '@axonivy/webservice-editor-protocol';
import { BasicField, Input, type MessageData } from '@axonivy/ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useValidateName, validateName } from '../../../hooks/useValidateAddWebService';

type NameInputProps = {
  value: string;
  onChange: (change: string) => void;
  webServices: WebServiceData[];
  message?: MessageData;
};

export const NameInput = ({ value, onChange, webServices, message }: NameInputProps) => {
  const { t } = useTranslation();
  const [currentValue, setCurrentValue] = useState(value ?? '');
  const [prevValue, setPrevValue] = useState(value);
  const nameValidationMessage = useValidateName(currentValue, webServices);
  if (value !== undefined && prevValue !== value) {
    setCurrentValue(value);
    setPrevValue(value);
  }
  const updateValue = (value: string) => {
    setCurrentValue(value);
    if (validateName(value, webServices) === undefined) {
      onChange?.(value);
    }
  };
  return (
    <BasicField label={t('common.label.name')} message={nameValidationMessage ?? message}>
      <Input value={currentValue} onChange={event => updateValue(event.target.value)} />
    </BasicField>
  );
};
