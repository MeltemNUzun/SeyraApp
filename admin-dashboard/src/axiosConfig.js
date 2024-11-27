// Create a separate file, e.g., axiosConfig.js
import axios from 'axios';

// Create an Axios instance
// axiosConfig.js dosyanızda


const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
});

// Geri kalan kod aynı kalabilir

// Add a request interceptor to include the Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
