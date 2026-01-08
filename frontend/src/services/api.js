import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/', // Adjust port if running on different port
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptors if needed (e.g., auth token)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
