/**
 * Production Configuration & Best Practices
 * This file contains production-ready configurations and utilities
 */

// Environment detection
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

// API Configuration
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: isProduction ? 30000 : 10000,
  retryAttempts: isProduction ? 3 : 1,
  retryDelay: 1000,
};

// Cache Configuration
export const CACHE_CONFIG = {
  images: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
  },
  profiles: {
    ttl: 10 * 60 * 1000, // 10 minutes
    maxSize: 50,
  },
  posts: {
    ttl: 2 * 60 * 1000, // 2 minutes
    maxSize: 100,
  },
};

// Security Configuration
export const SECURITY_CONFIG = {
  // Token expiry buffer (refresh before actual expiry)
  tokenExpiryBuffer: 5 * 60 * 1000, // 5 minutes
  
  // Password requirements
  password: {
    minLength: 6,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false,
  },
  
  // Rate limiting feedback
  rateLimitMessage: 'Too many requests. Please try again later.',
};

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  // Lazy loading
  lazyLoadOffset: 100, // pixels
  
  // Pagination
  defaultPageSize: 20,
  maxPageSize: 100,
  
  // Image optimization
  maxImageSize: 5 * 1024 * 1024, // 5MB
  acceptedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  
  // Debounce delays
  searchDebounce: 300, // ms
  resizeDebounce: 150, // ms
  scrollDebounce: 100, // ms
};

// Analytics Configuration (if needed)
export const ANALYTICS_CONFIG = {
  enabled: isProduction,
  trackPageViews: true,
  trackErrors: true,
  // Add your analytics IDs here
  // googleAnalyticsId: 'G-XXXXXXXXXX',
  // sentryDSN: 'https://xxx@sentry.io/xxx',
};

// Feature Flags
export const FEATURES = {
  enableEmailVerification: true,
  enablePasswordReset: true,
  enableProfileImages: true,
  enableComments: true,
  enableNotifications: false, // TODO: Implement
  enableDarkMode: false, // TODO: Implement
};

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  unauthorized: 'Session expired. Please login again.',
  forbidden: 'You do not have permission to perform this action.',
  notFound: 'The requested resource was not found.',
  serverError: 'Server error. Please try again later.',
  validationError: 'Please check your input and try again.',
  generic: 'An unexpected error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  login: 'Welcome back!',
  register: 'Registration successful! Please verify your email.',
  logout: 'Logged out successfully.',
  profileUpdate: 'Profile updated successfully!',
  passwordUpdate: 'Password updated successfully!',
  emailVerified: 'Email verified successfully!',
  postCreated: 'Post created successfully!',
  postUpdated: 'Post updated successfully!',
  postDeleted: 'Post deleted successfully!',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  token: 'token',
  refreshToken: 'refreshToken',
  user: 'user',
  theme: 'theme',
  language: 'language',
};

// Session Management
export const SESSION_CONFIG = {
  // Auto-logout after inactivity (in ms)
  inactivityTimeout: isProduction ? 30 * 60 * 1000 : null, // 30 minutes in production
  
  // Warning before auto-logout (in ms)
  inactivityWarning: 5 * 60 * 1000, // 5 minutes
  
  // Events that reset inactivity timer
  activityEvents: ['mousedown', 'keypress', 'scroll', 'touchstart'],
};

/**
 * Cleanup function to call on logout or session end
 */
export const cleanupSession = () => {
  // Clear local storage
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Clear session storage
  sessionStorage.clear();
  
  // Clear cookies if using them
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
};

/**
 * Security headers validation (for debugging)
 */
export const validateSecurityHeaders = async (url) => {
  if (!isProduction) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const headers = {
        'X-Content-Type-Options': response.headers.get('X-Content-Type-Options'),
        'X-Frame-Options': response.headers.get('X-Frame-Options'),
        'X-XSS-Protection': response.headers.get('X-XSS-Protection'),
        'Strict-Transport-Security': response.headers.get('Strict-Transport-Security'),
        'Content-Security-Policy': response.headers.get('Content-Security-Policy'),
      };
      console.log('Security Headers:', headers);
      return headers;
    } catch (error) {
      console.error('Failed to validate security headers:', error);
    }
  }
};

/**
 * Memory monitoring (development only)
 */
export const monitorMemory = () => {
  if (!isProduction && performance.memory) {
    const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
    const usedMB = (usedJSHeapSize / 1048576).toFixed(2);
    const totalMB = (totalJSHeapSize / 1048576).toFixed(2);
    const limitMB = (jsHeapSizeLimit / 1048576).toFixed(2);
    
    console.log(`Memory Usage: ${usedMB}MB / ${totalMB}MB (Limit: ${limitMB}MB)`);
    
    // Warn if using more than 80% of available memory
    if (usedJSHeapSize / jsHeapSizeLimit > 0.8) {
      console.warn('⚠️ High memory usage detected!');
    }
  }
};

// Export all configurations
export default {
  isProduction,
  isDevelopment,
  API_CONFIG,
  CACHE_CONFIG,
  SECURITY_CONFIG,
  PERFORMANCE_CONFIG,
  ANALYTICS_CONFIG,
  FEATURES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  SESSION_CONFIG,
  cleanupSession,
  validateSecurityHeaders,
  monitorMemory,
};
