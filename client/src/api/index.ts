import axios from 'axios';


const baseURL = import.meta.env.VITE_API_URL;


const API = axios.create({ baseURL: baseURL });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const signIn = (data :any ) => API.post('/auth/login', data);
export const signUp = (data :any) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');
export const saveTemplate = (data :any) => API.post('/templates/save', data);
export const fetchTemplates = () => API.get('/templates/all');
export const fetchTemplateById = (id : any ) => API.get(`/templates/${id}`);
export const deleteTemplate = (id : any) => API.delete(`/templates/${id}`);
export const uploadMedia = (data: FormData) => API.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });