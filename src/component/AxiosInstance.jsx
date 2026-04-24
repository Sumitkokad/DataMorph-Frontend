import axios from 'axios';

// ✅ Use .env instead of hardcoded URL
const API = import.meta.env.VITE_API_URL;

const AxiosInstance = axios.create({
  baseURL: API,   // 🔥 changed here
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 50000,
});

// ✅ Request interceptor
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    // Debug logs
    console.log(`🚀 Axios Request: ${config.method.toUpperCase()} ${API}${config.url}`);
    console.log('Request data:', config.data);
    console.log('Request headers:', config.headers);

    return config;
  },
  (error) => {
    console.error('❌ Axios Request Error:', error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor
AxiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ Axios Response: ${response.status} ${response.config.url}`);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ Axios Response Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    // 🔐 Handle unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;