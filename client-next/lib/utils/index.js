import axios from "axios";

export const serverUrl = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL || "";

export const api = axios.create({
  baseURL: `${serverUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout for slower connections
  withCredentials: false, // Change to true if using cookies
});

// Request interceptor - attach token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["x-auth-token"] = token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token expiry and errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          try {
            // Try to refresh the token
            const res = await axios.post(`${serverUrl}/api/users/refresh-token`, {
              refreshToken
            });

            const { token } = res.data;

            // Save new token
            localStorage.setItem("token", token);
            api.defaults.headers.common["x-auth-token"] = token;
            originalRequest.headers["x-auth-token"] = token;

            // Retry original request
            return api(originalRequest);
          } catch (refreshError) {
            // Refresh failed - clear everything and redirect
            clearAuthData();
            if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
              window.location.href = "/login";
            }
            return Promise.reject(refreshError);
          }
        } else {
          // No refresh token - clear and redirect
          clearAuthData();
          if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
            window.location.href = "/login";
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["x-auth-token"] = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem("token", token);
    }
  } else {
    delete api.defaults.headers.common["x-auth-token"];
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
    }
  }
};

export const setRefreshToken = (token) => {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem("refreshToken", token);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }
};

export const clearAuthData = () => {
  setAuthToken(null);
  setRefreshToken(null);
  clearAllImageCache();
};

import cacheManager from './cacheManager';

// Cache TTL for profile images (10 minutes)
const IMAGE_CACHE_TTL = 10 * 60 * 1000;

// Get profile image from userId - fetches from backend if needed
export const getProfileImage = async (userId) => {
  if (!userId) {
    return "/assets/default.png";
  }

  // Check cache first
  const cached = cacheManager.get('profileImages', userId);
  if (cached) {
    return cached;
  }

  try {
    // Fetch profile to get avatar
    const response = await api.get(`/profiles/user/${userId}`);
    const avatar = response.data?.avatar || "/assets/default.png";

    // Cache the result
    cacheManager.set('profileImages', userId, avatar, IMAGE_CACHE_TTL);
    return avatar;
  } catch (err) {
    // If profile not found or error, use default
    const defaultImg = "/assets/default.png";
    cacheManager.set('profileImages', userId, defaultImg, IMAGE_CACHE_TTL);
    return defaultImg;
  }
};

// Synchronous version that returns cached value or default immediately
export const getProfileImageSync = (userId) => {
  if (!userId) {
    return "/assets/default.png";
  }

  // Return cached value or default
  return cacheManager.get('profileImages', userId) || "/assets/default.png";
};

// Preload profile image into cache
export const preloadProfileImage = async (userId) => {
  if (!userId) return;

  const cached = cacheManager.get('profileImages', userId);
  if (cached) return;

  try {
    const response = await api.get(`/profiles/user/${userId}`);
    const avatar = response.data?.avatar || "/assets/default.png";
    cacheManager.set('profileImages', userId, avatar, IMAGE_CACHE_TTL);
  } catch (err) {
    // Silently handle errors - user might not have a profile yet
    // This is normal for new users, so don't log errors
    cacheManager.set('profileImages', userId, "/assets/default.png", IMAGE_CACHE_TTL);
  }
};

export const getProfileImageWithFallback = (userIdOrProfile, profileData = null) => {
  return getProfileImageSync(userIdOrProfile, profileData);
};

// Clear image cache for a specific user (call after profile image update)
export const clearImageCache = (userId) => {
  if (userId) {
    cacheManager.delete('profileImages', userId);
  }
};

// Clear all cached images (call on logout)
export const clearAllImageCache = () => {
  cacheManager.clear('profileImages');
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
  }).format(new Date(date));
};

export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 1) {
    return 'Just now';
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
};
