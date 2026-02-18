import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/auth' });

// Automatically attaches JWT token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Auth Endpoints
export const signIn = (data) => API.post('/login', data);
export const signUp = (data) => API.post('/register', data); 
export const getMe = () => API.get('/me');
export const forgotPassword = (email) => API.post('/forgot-password', { email });
export const resetPassword = (token, password) => API.put(`/reset-password/${token}`, { password });