// src/lib/api.ts - Enhanced version with proper TypeScript types
import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Extend the Axios config interface to include our custom metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with enhanced configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Error Response type definition
export interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Array<{
    message: string;
    field?: string;
    code?: string;
  }>;
  statusCode?: number;
  timestamp?: string;
  path?: string;
  success?: false;
}

// Request interceptor to add auth token and request logging
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add timestamp to requests for debugging
    config.metadata = { startTime: new Date() };
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('fixify_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling and logging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate request duration
    const startTime = response.config.metadata?.startTime;
    const duration = startTime ? new Date().getTime() - startTime.getTime() : 0;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
    }
    
    return response;
  },
  (error: AxiosError) => {
    const startTime = error.config?.metadata?.startTime;
    const duration = startTime ? new Date().getTime() - startTime.getTime() : 0;
    
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    // Handle specific error scenarios
    const status = error.response?.status;
    
    if (status === 401) {
      console.warn('🔐 Authentication failed - clearing stored data');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('fixify_token');
        localStorage.removeItem('fixify_user');
        localStorage.removeItem('fixify_user_role');
        
        // Only redirect if not already on auth page
        if (!window.location.pathname.includes('/auth')) {
          window.location.href = '/auth?reason=session_expired';
        }
      }
    } else if (status === 403) {
      console.warn('🚫 Access forbidden - insufficient permissions');
    } else if (status && status >= 500) {
      console.error('🔥 Server error - please try again later');
    } else if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timeout - please check your connection');
    }

    return Promise.reject(error);
  }
);

// Enhanced API endpoints with better organization
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    REFRESH_TOKEN: '/auth/refresh',
  },
  
  // Users
  USERS: {
    PROFILE: '/users/profile',
    BOOKINGS: '/users/bookings',
    WALLET_TRANSACTIONS: '/users/wallet/transactions',
    NOTIFICATIONS: '/users/notifications',
    UPDATE_PROFILE: '/users/profile',
  },
  
  // Services
  SERVICES: {
    LIST: '/services',
    CATEGORIES: '/services/categories',
    FEATURED: '/services/featured/list',
    BY_ID: (id: string) => `/services/${id}`,
    PROVIDER_SERVICES: '/services/provider/my-services',
    CREATE: '/services',
    UPDATE: (id: string) => `/services/${id}`,
    DELETE: (id: string) => `/services/${id}`,
    TOGGLE_STATUS: (id: string) => `/services/${id}/toggle-status`,
  },
  
  // Providers
  PROVIDERS: {
    LIST: '/providers',
    BY_ID: (id: string) => `/providers/${id}`,
    PROFILE: '/providers/profile',
    ME: '/providers/me',
    UPDATE_BOOKING_STATUS: (bookingId: string) => `/providers/bookings/${bookingId}/status`,
    DASHBOARD_STATS: '/providers/dashboard/stats',
    EARNINGS_SUMMARY: '/providers/earnings/summary',
  },
  
  // Bookings
  BOOKINGS: {
    CREATE: '/bookings',
    MY_BOOKINGS: '/bookings/my-bookings',
    PROVIDER_BOOKINGS: '/bookings/provider-bookings',
    BY_ID: (id: string) => `/bookings/${id}`,
    UPDATE_STATUS: (id: string) => `/bookings/${id}/status`,
    CANCEL: (id: string) => `/bookings/${id}/cancel`,
    STATS: '/bookings/stats/overview',
    RECENT: '/bookings/recent',
  },
  
  // Payments
  PAYMENTS: {
    PAYSTACK_INITIALIZE: '/payments/paystack/initialize',
    PAYSTACK_VERIFY: '/payments/paystack/verify',
    WALLET_ADD_FUNDS: '/payments/wallet/add-funds',
    WITHDRAW: '/payments/withdraw',
    HISTORY: '/payments/history',
    EARNINGS: '/payments/earnings',
  },
  
  // Reviews
  REVIEWS: {
    CREATE: '/reviews',
    BY_PROVIDER: (providerId: string) => `/reviews/provider/${providerId}`,
    BY_USER: '/reviews/my-reviews',
    UPDATE: (id: string) => `/reviews/${id}`,
    DELETE: (id: string) => `/reviews/${id}`,
  },
} as const;

// Type guard to check if error is an AxiosError
const isAxiosError = (error: unknown): error is AxiosError => {
  return error !== null && typeof error === 'object' && 'isAxiosError' in error;
};

// Type guard to check if response data is an API error
const isApiErrorResponse = (data: unknown): data is ApiErrorResponse => {
  return data !== null && 
         typeof data === 'object' && 
         (('message' in data) || ('error' in data) || ('errors' in data));
};

// Enhanced API service functions with better error handling
export const authAPI = {
  register: async (data: RegisterData): Promise<AxiosResponse> => {
    try {
      return await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  login: async (data: LoginData): Promise<AxiosResponse> => {
    try {
      return await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  me: async (): Promise<AxiosResponse> => {
    try {
      return await apiClient.get(API_ENDPOINTS.AUTH.ME);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  forgotPassword: async (email: string): Promise<AxiosResponse> => {
    try {
      return await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  resetPassword: async (token: string, password: string): Promise<AxiosResponse> => {
    try {
      return await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD.replace(':token', token), { password });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export const servicesAPI = {
  getCategories: async (): Promise<AxiosResponse> => {
    try {
      return await apiClient.get(API_ENDPOINTS.SERVICES.CATEGORIES);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  getServices: async (params?: ServicesParams): Promise<AxiosResponse> => {
    try {
      return await apiClient.get(API_ENDPOINTS.SERVICES.LIST, { params });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  getFeaturedServices: async (): Promise<AxiosResponse> => {
    try {
      return await apiClient.get(API_ENDPOINTS.SERVICES.FEATURED);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  getServiceById: async (id: string): Promise<AxiosResponse> => {
    try {
      return await apiClient.get(API_ENDPOINTS.SERVICES.BY_ID(id));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  create: async (data: CreateServiceData): Promise<AxiosResponse> => {
    try {
      return await apiClient.post(API_ENDPOINTS.SERVICES.CREATE, data);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  update: async (id: string, data: UpdateServiceData): Promise<AxiosResponse> => {
    try {
      return await apiClient.put(API_ENDPOINTS.SERVICES.UPDATE(id), data);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  delete: async (id: string): Promise<AxiosResponse> => {
    try {
      return await apiClient.delete(API_ENDPOINTS.SERVICES.DELETE(id));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  toggleStatus: async (id: string): Promise<AxiosResponse> => {
    try {
      return await apiClient.patch(API_ENDPOINTS.SERVICES.TOGGLE_STATUS(id));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export const bookingsAPI = {
  createBooking: async (data: CreateBookingData): Promise<AxiosResponse> => {
    try {
      return await apiClient.post(API_ENDPOINTS.BOOKINGS.CREATE, data);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  getMyBookings: async (params?: BookingsParams): Promise<AxiosResponse> => {
    try {
      return await apiClient.get(API_ENDPOINTS.BOOKINGS.MY_BOOKINGS, { params });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  getProviderBookings: async (params?: BookingsParams): Promise<AxiosResponse> => {
    try {
      return await apiClient.get(API_ENDPOINTS.BOOKINGS.PROVIDER_BOOKINGS, { params });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  updateBookingStatus: async (id: string, status: string): Promise<AxiosResponse> => {
    try {
      return await apiClient.put(API_ENDPOINTS.BOOKINGS.UPDATE_STATUS(id), { status });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  cancelBooking: async (id: string, reason?: string): Promise<AxiosResponse> => {
    try {
      return await apiClient.put(API_ENDPOINTS.BOOKINGS.CANCEL(id), { reason });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getBookingById: async (id: string): Promise<AxiosResponse> => {
    try {
      return await apiClient.get(API_ENDPOINTS.BOOKINGS.BY_ID(id));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getRecentBookings: async (): Promise<AxiosResponse> => {
    try {
      return await apiClient.get(API_ENDPOINTS.BOOKINGS.RECENT);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export const providersAPI = {
  getProviders: async (params?: ProvidersParams): Promise<AxiosResponse> => {
    try {
      return await apiClient.get(API_ENDPOINTS.PROVIDERS.LIST, { params });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  getProviderById: async (id: string): Promise<AxiosResponse> => {
    try {
      return await apiClient.get(API_ENDPOINTS.PROVIDERS.BY_ID(id));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  updateProfile: async (data: UpdateProviderData): Promise<AxiosResponse> => {
    try {
      return await apiClient.put(API_ENDPOINTS.PROVIDERS.PROFILE, data);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getMe: async (): Promise<AxiosResponse> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PROVIDERS.ME);
      
      // Cache the provider data for faster subsequent loads
      if (typeof window !== 'undefined' && response.data.success) {
        const cacheKey = 'provider_dashboard_cache';
        const cacheData = {
          data: response.data,
          timestamp: Date.now(),
          expires: Date.now() + (5 * 60 * 1000) // 5 minutes
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      }
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updateBookingStatus: async (bookingId: string, status: 'confirmed' | 'cancelled'): Promise<AxiosResponse> => {
    try {
      return await apiClient.put(API_ENDPOINTS.PROVIDERS.UPDATE_BOOKING_STATUS(bookingId), { status });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getDashboardStats: async (): Promise<AxiosResponse> => {
    try {
      return await apiClient.get(API_ENDPOINTS.PROVIDERS.DASHBOARD_STATS);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getEarningsSummary: async (): Promise<AxiosResponse> => {
    try {
      return await apiClient.get(API_ENDPOINTS.PROVIDERS.EARNINGS_SUMMARY);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export const paymentsAPI = {
  initializePayment: async (data: PaymentInitData): Promise<AxiosResponse> => {
    try {
      return await apiClient.post(API_ENDPOINTS.PAYMENTS.PAYSTACK_INITIALIZE, data);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  verifyPayment: async (reference: string): Promise<AxiosResponse> => {
    try {
      return await apiClient.post(API_ENDPOINTS.PAYMENTS.PAYSTACK_VERIFY, { reference });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  withdraw: async (data: WithdrawData): Promise<AxiosResponse> => {
    try {
      return await apiClient.post(API_ENDPOINTS.PAYMENTS.WITHDRAW, data);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getHistory: async (params?: PaymentHistoryParams): Promise<AxiosResponse> => {
    try {
      return await apiClient.get(API_ENDPOINTS.PAYMENTS.HISTORY, { params });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getEarnings: async (): Promise<AxiosResponse> => {
    try {
      return await apiClient.get(API_ENDPOINTS.PAYMENTS.EARNINGS);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export const reviewsAPI = {
  create: async (data: CreateReviewData): Promise<AxiosResponse> => {
    try {
      return await apiClient.post(API_ENDPOINTS.REVIEWS.CREATE, data);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getByProvider: async (providerId: string, params?: ReviewParams): Promise<AxiosResponse> => {
    try {
      return await apiClient.get(API_ENDPOINTS.REVIEWS.BY_PROVIDER(providerId), { params });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getMyReviews: async (): Promise<AxiosResponse> => {
    try {
      return await apiClient.get(API_ENDPOINTS.REVIEWS.BY_USER);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  update: async (id: string, data: Partial<CreateReviewData>): Promise<AxiosResponse> => {
    try {
      return await apiClient.put(API_ENDPOINTS.REVIEWS.UPDATE(id), data);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  delete: async (id: string): Promise<AxiosResponse> => {
    try {
      return await apiClient.delete(API_ENDPOINTS.REVIEWS.DELETE(id));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// Enhanced type definitions
export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role?: 'user' | 'provider';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ServicesParams {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  isActive?: boolean;
}

export interface CreateServiceData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  isActive?: boolean;
  duration?: number;
  tags?: string[];
}

export interface UpdateServiceData {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  imageUrl?: string;
  isActive?: boolean;
  duration?: number;
  tags?: string[];
}

export interface CreateBookingData {
  serviceId: string;
  scheduledDate: string;
  scheduledTime?: string;
  address: {
    street: string;
    city: string;
    state: string;
    landmark?: string;
    postalCode?: string;
  };
  specialInstructions?: string;
  paymentMethod: 'card' | 'wallet' | 'paystack';
  urgency?: 'low' | 'medium' | 'high';
}

export interface BookingsParams {
  status?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface ProvidersParams {
  page?: number;
  limit?: number;
  city?: string;
  category?: string;
  minRating?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  isVerified?: boolean;
  isAvailable?: boolean;
}

export interface UpdateProviderData {
  businessName?: string;
  bio?: string;
  skills?: string[];
  experience?: number;
  hourlyRate?: number;
  workingHours?: {
    [key: string]: {
      start: string;
      end: string;
      available: boolean;
    };
  };
  serviceRadius?: number;
  portfolio?: Array<{
    title: string;
    description: string;
    imageUrl: string;
    completedDate: string;
  }>;
}

export interface PaymentInitData {
  amount: number;
  email: string;
  reference?: string;
  metadata?: {
    bookingId?: string;
    serviceId?: string;
    customerId?: string;
    [key: string]: any;
  };
}

export interface WithdrawData {
  amount: number;
  bankAccount: string;
  providerId?: string;
  description?: string;
}

export interface PaymentHistoryParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateReviewData {
  providerId: string;
  bookingId: string;
  rating: number;
  comment: string;
  serviceQuality?: number;
  communication?: number;
  punctuality?: number;
  cleanliness?: number;
}

export interface ReviewParams {
  page?: number;
  limit?: number;
  minRating?: number;
  maxRating?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Enhanced utility functions with proper error typing
export const handleApiError = (error: unknown): string => {
  if (isAxiosError(error)) {
    const responseData = error.response?.data;
    
    if (isApiErrorResponse(responseData)) {
      if (responseData.message) {
        return responseData.message;
      } else if (responseData.error) {
        return responseData.error;
      } else if (responseData.errors && responseData.errors.length > 0) {
        return responseData.errors[0].message;
      }
    }
    
    if (error.message) {
      return error.message;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Cache utilities with proper typing
interface CacheData<T = any> {
  data: T;
  timestamp: number;
  expires: number;
}

export const getCachedData = <T = any>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const parsed: CacheData<T> = JSON.parse(cached);
    if (Date.now() > parsed.expires) {
      localStorage.removeItem(key);
      return null;
    }
    
    return parsed.data;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

export const setCachedData = <T = any>(key: string, data: T, expirationMinutes: number = 5): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheData: CacheData<T> = {
      data,
      timestamp: Date.now(),
      expires: Date.now() + (expirationMinutes * 60 * 1000)
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

// Helper functions
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('fixify_token');
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const getUserRole = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('fixify_user_role');
  }
  return null;
};

export const clearAuthData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('fixify_token');
    localStorage.removeItem('fixify_user');
    localStorage.removeItem('fixify_user_role');
    localStorage.removeItem('provider_dashboard_cache');
  }
};

// Request retry utility with proper typing
export const retryRequest = async <T>(
  requestFn: () => Promise<T>, 
  maxRetries: number = 3, 
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) break;
      
      // Don't retry on certain error types
      if (isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          break;
        }
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
};

export default apiClient;