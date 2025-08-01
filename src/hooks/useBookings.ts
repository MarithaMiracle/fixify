// src/hooks/useBookings.ts
import { useState, useEffect, useCallback } from 'react';
import { bookingsAPI, BookingsParams } from '../lib/api';

export const useBookings = (type: 'user' | 'provider' = 'user', params?: BookingsParams) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(null);

  // Use useCallback to memoize the fetch function
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = type === 'user' 
        ? await bookingsAPI.getMyBookings(params)
        : await bookingsAPI.getProviderBookings(params);
      
      if (response.data.success) {
        setBookings(response.data.data.bookings);
        setPagination(response.data.data.pagination);
      } else {
        setError(response.data.message || 'Failed to fetch bookings');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [type, params]); // Remove JSON.stringify, use params directly

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Simplified refetch function
  const refetch = useCallback(async () => {
    await fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, pagination, refetch };
};

// Alternative version with better dependency handling
export const useBookingsOptimized = (type: 'user' | 'provider' = 'user', params?: BookingsParams) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = type === 'user' 
          ? await bookingsAPI.getMyBookings(params)
          : await bookingsAPI.getProviderBookings(params);
        
        if (isMounted && response.data.success) {
          setBookings(response.data.data.bookings);
          setPagination(response.data.data.pagination);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to fetch bookings');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [type, params?.status, params?.page, params?.limit]); // Only depend on specific params

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = type === 'user' 
        ? await bookingsAPI.getMyBookings(params)
        : await bookingsAPI.getProviderBookings(params);
      
      if (response.data.success) {
        setBookings(response.data.data.bookings);
        setPagination(response.data.data.pagination);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [type, params]);

  return { bookings, loading, error, pagination, refetch };
};