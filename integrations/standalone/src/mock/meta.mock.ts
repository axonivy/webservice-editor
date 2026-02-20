import type { JavaType, WebServicePropertyMeta } from '@axonivy/webservice-editor-protocol';

export const META_PROPS = [
  {
    property: 'jersey.client.pool.maxConnections',
    description:
      'Maximum number of connections to pool.\nOnly has an effect if no or the Apache connector provider is set.\nOnly has an effect when set in the REST Client Editor, cannot be changed during execution.\nDefault: 5'
  },
  { property: 'jersey.config.client.readTimeout', description: 'Read timeout interval, in milliseconds.\nDefault: 30000' },
  { property: 'JSON.Mapper.INVERSE_READ_WRITE_ACCESS', description: '\nDefault: false' },
  { property: 'username', description: 'The username used for authentication by Basic, Digest or NTLM authentication.' },
  { property: 'password', description: 'The password used for authentication by Basic, Digest or NTLM authentication.' },
  {
    property: 'SSL.keyAlias',
    description:
      'The keystore key alias to use if the SSL connection to the REST service is configured to use client authentication.\nThis configuration can only be set in the REST Client configuration and cannot be configured in the REST Client call step.\nBy default no keystore key alias is definied.'
  }
] as const satisfies WebServicePropertyMeta[];

export const META_FEATURES = [
  {
    simpleName: 'MultiPartFeature',
    packageName: 'org.glassfish.jersey.media.multipart',
    fullQualifiedName: 'org.glassfish.jersey.media.multipart.MultiPartFeature'
  },
  {
    simpleName: 'MonitoringFeature',
    packageName: 'org.glassfish.jersey.server.internal.monitoring',
    fullQualifiedName: 'org.glassfish.jersey.server.internal.monitoring.MonitoringFeature'
  }
] as const satisfies JavaType[];
