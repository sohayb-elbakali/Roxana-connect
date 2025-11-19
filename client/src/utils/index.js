import axios from "axios";

export const serverUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

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
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
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

      // Clear invalid token
      localStorage.removeItem("token");
      delete api.defaults.headers.common["x-auth-token"];
      
      // Redirect to login if on a protected route
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["x-auth-token"] = token;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["x-auth-token"];
    localStorage.removeItem("token");
  }
};

// Cache for profile image URLs with timestamps
const imageCache = new Map();

// Get profile image from profile object or userId
export const getProfileImage = (userIdOrProfile, profileData = null) => {
  // If first param is a profile object with avatar
  if (typeof userIdOrProfile === 'object' && userIdOrProfile?.avatar) {
    return userIdOrProfile.avatar;
  }
  
  // If profileData is provided and has avatar
  if (profileData?.avatar) {
    return profileData.avatar;
  }
  
  // Fall back to default avatar
  return `${serverUrl}/default.png`;
};

export const getProfileImageWithFallback = (userIdOrProfile, profileData = null) => {
  return getProfileImage(userIdOrProfile, profileData);
};

// Clear image cache for a specific user (call after profile image update)
export const clearImageCache = (userId) => {
  if (userId) {
    imageCache.delete(userId);
  }
};

// Clear all cached images (call on logout)
export const clearAllImageCache = () => {
  imageCache.clear();
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
