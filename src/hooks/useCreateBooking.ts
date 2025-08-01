import { useState } from 'react';
import { bookingsAPI, CreateBookingData } from '../lib/api';

export const useCreateBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (data: CreateBookingData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bookingsAPI.createBooking(data);
      
      if (response.data.success) {
        return response.data.data.booking;
      } else {
        throw new Error(response.data.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create booking';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading, error };
};