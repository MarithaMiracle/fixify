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
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('fixify_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('fixify_token');
        localStorage.removeItem('fixify_user_role');
        window.location.href = '/auth';
      }
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
    CREATE: '/services',
    UPDATE: (id: string) => `/services/${id}`,
    DELETE: (id: string) => `/services/${id}`,
  },
  
  // Providers
  PROVIDERS: {
    LIST: '/providers',
    BY_ID: (id: string) => `/providers/${id}`,
    PROFILE: '/providers/profile',
    ME: '/providers/me',
    UPDATE_BOOKING_STATUS: (bookingId: string) => `/providers/bookings/${bookingId}/status`,
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
    WITHDRAW: '/payments/withdraw',
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

  create: (data: CreateServiceData) =>
    apiClient.post(API_ENDPOINTS.SERVICES.CREATE, data),

  update: (id: string, data: UpdateServiceData) =>
    apiClient.put(API_ENDPOINTS.SERVICES.UPDATE(id), data),

  delete: (id: string) =>
    apiClient.delete(API_ENDPOINTS.SERVICES.DELETE(id)),
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

  getMe: () => 
    apiClient.get(API_ENDPOINTS.PROVIDERS.ME),

  updateBookingStatus: (bookingId: string, status: 'confirmed' | 'cancelled') =>
    apiClient.put(API_ENDPOINTS.PROVIDERS.UPDATE_BOOKING_STATUS(bookingId), { status }),
};

export const paymentsAPI = {
  initializePayment: (data: PaymentInitData) =>
    apiClient.post(API_ENDPOINTS.PAYMENTS.PAYSTACK_INITIALIZE, data),

  verifyPayment: (reference: string) =>
    apiClient.post(API_ENDPOINTS.PAYMENTS.PAYSTACK_VERIFY, { reference }),

  withdraw: (data: WithdrawData) =>
    apiClient.post(API_ENDPOINTS.PAYMENTS.WITHDRAW, data),

  getHistory: (params?: PaymentHistoryParams) =>
    apiClient.get(API_ENDPOINTS.PAYMENTS.HISTORY, { params }),
};

export const reviewsAPI = {
  create: (data: CreateReviewData) =>
    apiClient.post(API_ENDPOINTS.REVIEWS.CREATE, data),

  getByProvider: (providerId: string, params?: ReviewParams) =>
    apiClient.get(API_ENDPOINTS.REVIEWS.BY_PROVIDER(providerId), { params }),
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

export interface CreateServiceData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface UpdateServiceData {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  imageUrl?: string;
  isActive?: boolean;
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

export interface PaymentInitData {
  amount: number;
  email: string;
  reference?: string;
  metadata?: object;
}

export interface WithdrawData {
  amount: number;
  bankAccount: string;
  providerId?: string;
}

export interface PaymentHistoryParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}

export interface CreateReviewData {
  providerId: string;
  bookingId: string;
  rating: number;
  comment: string;
}

export interface ReviewParams {
  page?: number;
  limit?: number;
}

// Utility function to handle API errors
export const handleApiError = (error: any) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.message) {
    return error.message;
  } else {
    return 'An unexpected error occurred';
  }
};

// Helper function to get auth token
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('fixify_token');
  }
  return null;
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Helper function to get user role
export const getUserRole = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('fixify_user_role');
  }
  return null;
};

export default apiClient;