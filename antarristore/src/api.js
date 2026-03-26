import axios from 'axios';

// This checks if a Vercel environment variable exists; otherwise, it falls back to localhost for your development.
const API_BASE_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'http://localhost:5000/api';

const API = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true // Important for cross-origin requests and cookies
});

// This automatically attaches your JWT token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Optional: Add an error interceptor to help you debug live
API.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("🌐 API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default API;