import axios from 'axios';

// ✅ Dynamic backend URL switching based on hostname
const getBaseURL = () => {
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        return 'http://localhost:5000/api';
    }
    return 'https://antarri-backend.onrender.com/api';
};

const API = axios.create({
    baseURL: getBaseURL()
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
console.log("Current API Target:", getBaseURL());

export default API;