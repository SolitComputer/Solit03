import { useCallback } from 'react';
import { useFunnelContext } from '../context/FunnelContext';

export const useFunnelNavigation = () => {
  const { currentPanel, filters, mode, path, categoryLabel } = useFunnelContext();

  const buildHash = useCallback((panel) => {
    const params = new URLSearchParams();
    params.set('panel', panel);
    if (mode) params.set('mode', mode);
    if (filters.min_price !== null) params.set('min', filters.min_price);
    if (filters.max_price !== null) params.set('max', filters.max_price);
    if (filters.brand_slug) params.set('brand', filters.brand_slug);
    if (filters.tags?.length) params.set('tags', filters.tags.join(','));
    if (filters.category_slugs?.length) params.set('cats', filters.category_slugs.join(','));
    return '#' + params.toString();
  }, [mode, filters]);

  const pushState = useCallback((panel) => {
    const hash = buildHash(panel);
    window.history.pushState({ panel, filters, mode, path, catLabel: categoryLabel }, '', hash);
  }, [buildHash, filters, mode, path, categoryLabel]);

  const replaceState = useCallback((panel) => {
    const hash = buildHash(panel);
    window.history.replaceState({ panel, filters, mode, path, catLabel: categoryLabel }, '', hash);
  }, [buildHash, filters, mode, path, categoryLabel]);

  return {
    buildHash,
    pushState,
    replaceState
  };
};