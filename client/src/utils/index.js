import axios from "axios";

export const serverUrl = "http://localhost:4000";

export const api = axios.create({
  baseURL: `${serverUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["x-auth-token"] = token;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["x-auth-token"];
    localStorage.removeItem("token");
  }
};

export const getProfileImage = (userId) => {
  if (!userId) {
    return `${serverUrl}/default.png`;
  }
  return `${serverUrl}/images/${userId}`;
};

export const getProfileImageWithFallback = (userId) => {
  if (!userId) {
    return `${serverUrl}/default.png`;
  }
  return `${serverUrl}/images/${userId}`;
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
  }).format(new Date(date));
};
