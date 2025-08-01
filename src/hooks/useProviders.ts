import { providersAPI, ProvidersParams } from '../lib/api';
import { useState, useEffect, useCallback } from 'react';

export const useProviders = (params?: ProvidersParams) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const response = await providersAPI.getProviders(params);
        if (response.data.success) {
          setProviders(response.data.data.providers);
          setPagination(response.data.data.pagination);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch providers');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [JSON.stringify(params)]);

  return { providers, loading, error, pagination };
};