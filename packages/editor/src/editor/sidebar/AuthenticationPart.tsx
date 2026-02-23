import { BasicField, BasicInput, Field, Flex, Label, PasswordInput, RadioGroup, RadioGroupItem } from '@axonivy/ui-components';
import type { WebServiceData } from '@axonivy/webservice-editor-protocol';
import { useTranslation } from 'react-i18next';

type AuthenticationType = 'none' | 'basic' | 'digest' | 'ntlm' | 'ws-security';
const BASIC_AUTH_FEATURE = 'ch.ivyteam.ivy.webservice.exec.cxf.feature.HttpBasicAuthenticationFeature' as const;
const DIGEST_AUTH_FEATURE = 'ch.ivyteam.ivy.webservice.exec.cxf.feature.HttpDigestAuthenticationFeature' as const;
const NTLM_AUTH_FEATURE = 'ch.ivyteam.ivy.webservice.exec.cxf.feature.NTLMAuthenticationFeature' as const;
const WS_SECURITY_AUTH_FEATURE = 'ch.ivyteam.ivy.webservice.exec.cxf.feature.WSSecurityAuthenticationFeature' as const;

type AuthenticationPartProps = {
  webService: WebServiceData;
  handleAttributeChange: <T extends keyof WebServiceData>(key: T, value: WebServiceData[T]) => void;
};

export const AuthenticationPart = ({ webService, handleAttributeChange }: AuthenticationPartProps) => {
  const { t } = useTranslation();
  let value: AuthenticationType = 'none';
  if (webService.features.includes(BASIC_AUTH_FEATURE)) {
    value = 'basic';
  } else if (webService.features.includes(DIGEST_AUTH_FEATURE)) {
    value = 'digest';
  } else if (webService.features.includes(NTLM_AUTH_FEATURE)) {
    value = 'ntlm';
  } else if (webService.features.includes(WS_SECURITY_AUTH_FEATURE)) {
    value = 'ws-security';
  }

  const onAuthenticationChange = (newValue: AuthenticationType) => {
    const features = webService.features.filter(
      f => f !== BASIC_AUTH_FEATURE && f !== DIGEST_AUTH_FEATURE && f !== NTLM_AUTH_FEATURE && f !== WS_SECURITY_AUTH_FEATURE
    );
    if (newValue === 'basic') {
      features.push(BASIC_AUTH_FEATURE);
    } else if (newValue === 'digest') {
      features.push(DIGEST_AUTH_FEATURE);
    } else if (newValue === 'ntlm') {
      features.push(NTLM_AUTH_FEATURE);
    } else if (newValue === 'ws-security') {
      features.push(WS_SECURITY_AUTH_FEATURE);
    }
    handleAttributeChange('features', features);
  };

  const updateProperty = (key: 'username' | 'password', value: string, type: 'STRING' | 'PASSWORD') => {
    const properties = [...webService.properties];
    const index = properties.findIndex(p => p.key === key);
    if (index !== -1) {
      if (value) {
        properties[index] = { type, key, value };
      } else {
        properties.splice(index, 1);
      }
    } else if (value) {
      properties.push({ type, key, value });
    }
    handleAttributeChange('properties', properties);
  };

  const onUsernameChange = (username: string) => updateProperty('username', username, 'STRING');
  const onPasswordChange = (password: string) => updateProperty('password', password, 'PASSWORD');

  return (
    <Flex direction='column' gap={3}>
      <RadioGroup value={value} onValueChange={change => onAuthenticationChange(change as AuthenticationType)} style={{ flexWrap: 'wrap' }}>
        <Field direction='row' alignItems='center' gap={2}>
          <RadioGroupItem value='none' />
          <Label>{t('label.authentication.none')}</Label>
        </Field>
        <Field direction='row' alignItems='center' gap={2}>
          <RadioGroupItem value='basic' />
          <Label>{t('label.authentication.basic')}</Label>
        </Field>
        <Field direction='row' alignItems='center' gap={2}>
          <RadioGroupItem value='digest' />
          <Label>{t('label.authentication.digest')}</Label>
        </Field>
        <Field direction='row' alignItems='center' gap={2}>
          <RadioGroupItem value='ntlm' />
          <Label>{t('label.authentication.ntlm')}</Label>
        </Field>
        <Field direction='row' alignItems='center' gap={2}>
          <RadioGroupItem value='ws-security' />
          <Label>{t('label.authentication.wsSecurity')}</Label>
        </Field>
      </RadioGroup>
      <BasicField label={t('common.label.username')}>
        <BasicInput
          value={webService.properties.find(p => p.key === 'username')?.value ?? ''}
          onChange={event => onUsernameChange(event.target.value)}
        />
      </BasicField>
      <BasicField label={t('common.label.password')}>
        <PasswordInput value={webService.properties.find(p => p.key === 'password')?.value ?? ''} onChange={onPasswordChange} />
      </BasicField>
    </Flex>
  );
};
