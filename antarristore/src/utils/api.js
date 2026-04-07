import axios from 'axios';

// ✅ Direct backend URL (no env, no conditions)
const API = axios.create({
    baseURL: 'https://antarri-backend.onrender.com/api'
});

// ✅ Attach JWT token for protected routes
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// ✅ Debug log
console.log("Current API Target:", 'https://antarri-backend.onrender.com/api');

export default API;