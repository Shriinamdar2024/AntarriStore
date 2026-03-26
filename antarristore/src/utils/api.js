import axios from 'axios';

// 1. Define the live Render URL
const LIVE_BACKEND_URL = 'https://antarri-backend.onrender.com/api';

// 2. Determine which URL to use
const API_BASE_URL = import.meta.env.PROD
    ? LIVE_BACKEND_URL
    : 'http://localhost:5000/api';

const API = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

// Attach Token
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;