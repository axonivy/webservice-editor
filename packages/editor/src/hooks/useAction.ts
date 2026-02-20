import type { WebServiceActionArgs } from '@axonivy/webservice-editor-protocol';
import { useAppContext } from '../context/AppContext';
import { useClient } from '../context/ClientContext';

export function useAction(actionId: WebServiceActionArgs['actionId']) {
  const { context } = useAppContext();
  const client = useClient();

  return (content?: WebServiceActionArgs['payload']) => {
    let payload = content ?? '';
    if (typeof payload === 'object') {
      payload = JSON.stringify(payload);
    }
    client.action({ actionId, context, payload });
  };
}
