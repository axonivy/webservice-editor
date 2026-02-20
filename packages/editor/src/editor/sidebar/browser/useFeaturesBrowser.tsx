import type { JavaType } from '@axonivy/webservice-editor-protocol';
import { useBrowser, type Browser, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../../../context/AppContext';
import { useMeta } from '../../../hooks/useMeta';
import { useBrowserData } from './browser-data';

export const FEATURES_BROWSER_ID = 'Features';

export const useFeaturesBrowser = (initialSearch: string): Browser => {
  const { context } = useAppContext();
  const meta = useMeta('meta/features/all', context);
  const features = useBrowserData(meta, javaTypeToBrowserNode);
  const browser = useBrowser(features, { initialSearch: initialSearch.substring(initialSearch.lastIndexOf('.') + 1) });
  return {
    name: FEATURES_BROWSER_ID,
    icon: IvyIcons.Function,
    browser,
    infoProvider: row => (row?.original.data ? (row?.original.data as JavaType).fullQualifiedName : ''),
    applyModifier: row => ({ value: row?.original.data ? (row?.original.data as JavaType).fullQualifiedName : '' })
  };
};

const javaTypeToBrowserNode = (feature: JavaType): BrowserNode<JavaType> => ({
  value: feature.simpleName,
  info: feature.packageName,
  data: feature,
  children: []
});
