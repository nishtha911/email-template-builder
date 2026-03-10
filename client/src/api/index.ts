import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const signIn = (data) => API.post('/auth/login', data);
export const signUp = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');
export const saveTemplate = (data) => API.post('/templates/save', data);
export const fetchTemplates = () => API.get('/templates/all');
export const fetchTemplateById = (id) => API.get(`/templates/${id}`);
export const deleteTemplate = (id) => API.delete(`/templates/${id}`);