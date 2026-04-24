import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.DEV) return "http://127.0.0.1:8000";
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  return "https://datamorph-backend-nmvo.onrender.com"; // Production fallback
};

const API = axios.create({
  baseURL: getBaseURL(),
});

// Add auth token interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});


export default API;
