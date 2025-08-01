import { useState, useEffect } from 'react';
import { servicesAPI, ServicesParams } from '../lib/api';

export const useServices = (params?: ServicesParams) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await servicesAPI.getServices(params);
        if (response.data.success) {
          setServices(response.data.data.services);
          setPagination(response.data.data.pagination);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [JSON.stringify(params)]);

  return { services, loading, error, pagination };
};
