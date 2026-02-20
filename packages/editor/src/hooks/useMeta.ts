import type { WebServiceMetaRequestTypes } from '@axonivy/webservice-editor-protocol';
import { useQuery } from '@tanstack/react-query';
import { useClient } from '../context/ClientContext';
import { genQueryKey } from '../query/query-client';

export function useMeta<TMeta extends keyof WebServiceMetaRequestTypes>(
  path: TMeta,
  args: WebServiceMetaRequestTypes[TMeta][0],
  options?: { disable?: boolean }
) {
  const client = useClient();
  return useQuery({
    enabled: !options?.disable,
    queryKey: genQueryKey(path, args),
    queryFn: () => client.meta(path, args)
  });
}
