import type { JavaType, WsPropertyMeta } from '@axonivy/webservice-editor-protocol';

export const META_PROPS = [
  {
    property: 'javax.xml.ws.client.connectionTimeout',
    description:
      'Specifies the amount of time, in milliseconds, that the consumer will attempt to establish a connection before it times out.\nDefault: 30000'
  },
  {
    property: 'proxy.host',
    description: 'The name of the proxy server. Used by the ch.ivyteam.ivy.webservice.exec.cxf.feature.ProxyFeature'
  },
  { property: 'username', description: 'The username used to authenticate on the remote web service' },
  { property: 'password', description: 'The password used to authenticate on the remote web service' }
] as const satisfies WsPropertyMeta[];

export const META_FEATURES = [
  {
    simpleName: 'IgnorePolicyFeature',
    packageName: 'ch.ivyteam.ivy.webservice.exec.cxf.feature.policy',
    fullQualifiedName: 'ch.ivyteam.ivy.webservice.exec.cxf.feature.policy.IgnorePolicyFeature'
  },
  {
    simpleName: 'ProxyFeature',
    packageName: 'ch.ivyteam.ivy.webservice.exec.cxf.feature',
    fullQualifiedName: 'ch.ivyteam.ivy.webservice.exec.cxf.feature.ProxyFeature'
  }
] as const satisfies JavaType[];
