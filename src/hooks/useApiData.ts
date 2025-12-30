import { useState, useEffect, useCallback } from 'react';
import { ApiConfig } from '@/types/dashboard';

interface ApiDataState {
  data: unknown;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

function getNestedValue(obj: unknown, path: string): unknown {
  if (!path) return obj;
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return result;
}

export function useApiData(apiConfig?: ApiConfig) {
  const [state, setState] = useState<ApiDataState>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const fetchData = useCallback(async () => {
    if (!apiConfig?.endpoint) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(apiConfig.endpoint, {
        method: apiConfig.method || 'GET',
        headers: apiConfig.headers || {},
        body: apiConfig.method === 'POST' ? apiConfig.body : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      const displayValue = apiConfig.displayField 
        ? getNestedValue(json, apiConfig.displayField)
        : json;

      setState({
        data: displayValue,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : '取得資料失敗',
      }));
    }
  }, [apiConfig?.endpoint, apiConfig?.method, apiConfig?.headers, apiConfig?.body, apiConfig?.displayField]);

  useEffect(() => {
    if (!apiConfig?.endpoint) return;

    fetchData();

    if (apiConfig.refreshInterval && apiConfig.refreshInterval > 0) {
      const interval = setInterval(fetchData, apiConfig.refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [fetchData, apiConfig?.endpoint, apiConfig?.refreshInterval]);

  return { ...state, refresh: fetchData };
}
