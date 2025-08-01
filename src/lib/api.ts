// src/lib/api.ts
import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fixify_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('fixify_token');
      localStorage.removeItem('fixify_user_role');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// API endpoints
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
  },
  
  // Users
  USERS: {
    PROFILE: '/users/profile',
    BOOKINGS: '/users/bookings',
    WALLET_TRANSACTIONS: '/users/wallet/transactions',
    NOTIFICATIONS: '/users/notifications',
  },
  
  // Services
  SERVICES: {
    LIST: '/services',
    CATEGORIES: '/services/categories',
    FEATURED: '/services/featured/list',
    BY_ID: (id: string) => `/services/${id}`,
    PROVIDER_SERVICES: '/services/provider/my-services',
  },
  
  // Providers
  PROVIDERS: {
    LIST: '/providers',
    BY_ID: (id: string) => `/providers/${id}`,
    PROFILE: '/providers/profile',
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
  },
  
  // Payments
  PAYMENTS: {
    PAYSTACK_INITIALIZE: '/payments/paystack/initialize',
    PAYSTACK_VERIFY: '/payments/paystack/verify',
    WALLET_ADD_FUNDS: '/payments/wallet/add-funds',
    HISTORY: '/payments/history',
  },
  
  // Reviews
  REVIEWS: {
    CREATE: '/reviews',
    BY_PROVIDER: (providerId: string) => `/reviews/provider/${providerId}`,
  },
  
  // Upload
  UPLOAD: {
    PROFILE_IMAGE: '/upload/profile-image',
    SERVICE_IMAGES: '/upload/service-images',
    PORTFOLIO_IMAGES: '/upload/portfolio-images',
  },
  
  // Admin
  ADMIN: {
    DASHBOARD_STATS: '/admin/dashboard/stats',
    USERS: '/admin/users',
    PROVIDERS_PENDING: '/admin/providers/pending',
    CATEGORIES: '/admin/categories',
  },
};

// API service functions
export const authAPI = {
  register: (data: RegisterData) => 
    apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data),
  
  login: (data: LoginData) => 
    apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data),
  
  me: () => 
    apiClient.get(API_ENDPOINTS.AUTH.ME),
  
  forgotPassword: (email: string) => 
    apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),
  
  resetPassword: (token: string, password: string) => 
    apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD.replace(':token', token), { password }),
};

export const servicesAPI = {
  getCategories: () => 
    apiClient.get(API_ENDPOINTS.SERVICES.CATEGORIES),
  
  getServices: (params?: ServicesParams) => 
    apiClient.get(API_ENDPOINTS.SERVICES.LIST, { params }),
  
  getFeaturedServices: () => 
    apiClient.get(API_ENDPOINTS.SERVICES.FEATURED),
  
  getServiceById: (id: string) => 
    apiClient.get(API_ENDPOINTS.SERVICES.BY_ID(id)),
};

export const bookingsAPI = {
  createBooking: (data: CreateBookingData) => 
    apiClient.post(API_ENDPOINTS.BOOKINGS.CREATE, data),
  
  getMyBookings: (params?: BookingsParams) => 
    apiClient.get(API_ENDPOINTS.BOOKINGS.MY_BOOKINGS, { params }),
  
  getProviderBookings: (params?: BookingsParams) => 
    apiClient.get(API_ENDPOINTS.BOOKINGS.PROVIDER_BOOKINGS, { params }),
  
  updateBookingStatus: (id: string, status: string) => 
    apiClient.put(API_ENDPOINTS.BOOKINGS.UPDATE_STATUS(id), { status }),
  
  cancelBooking: (id: string, reason?: string) => 
    apiClient.put(API_ENDPOINTS.BOOKINGS.CANCEL(id), { reason }),
};

export const providersAPI = {
  getProviders: (params?: ProvidersParams) => 
    apiClient.get(API_ENDPOINTS.PROVIDERS.LIST, { params }),
  
  getProviderById: (id: string) => 
    apiClient.get(API_ENDPOINTS.PROVIDERS.BY_ID(id)),
  
  updateProfile: (data: UpdateProviderData) => 
    apiClient.put(API_ENDPOINTS.PROVIDERS.PROFILE, data),
};

// Type definitions
export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role?: 'user' | 'provider';
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
}

export interface CreateBookingData {
  serviceId: string;
  scheduledDate: string;
  scheduledTime: string;
  address: {
    street: string;
    city: string;
    state: string;
    landmark?: string;
  };
  specialInstructions?: string;
  paymentMethod: 'card' | 'wallet' | 'paystack';
}

export interface BookingsParams {
  status?: string;
  page?: number;
  limit?: number;
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
}

export interface UpdateProviderData {
  businessName?: string;
  bio?: string;
  skills?: string[];
  experience?: number;
  hourlyRate?: number;
  workingHours?: object;
  serviceRadius?: number;
}