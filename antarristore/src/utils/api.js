import axios from 'axios';

// ✅ Direct backend URL (no env, no conditions)
const API = axios.create({
    baseURL: 'http://localhost:5000/api'
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
console.log("Current API Target:", 'http://localhost:5000/api');

export default API;