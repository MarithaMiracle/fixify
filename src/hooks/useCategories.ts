import { useState, useEffect, useCallback } from 'react';
import { servicesAPI } from '../lib/api';

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          setLoading(true);
          const response = await servicesAPI.getCategories();
          if (response.data.success) {
            setCategories(response.data.data.categories);
          }
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to fetch categories');
        } finally {
          setLoading(false);
        }
      };
  
      fetchCategories();
    }, []);
  
    return { categories, loading, error };
  };