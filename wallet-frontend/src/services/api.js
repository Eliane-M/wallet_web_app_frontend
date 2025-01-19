import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// authorization header for protected routes
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `access ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (username, password) => {
        try {
            console.log('Attempting to login')
            const response = await api.post('/auth/login/', { username, password });
            console.log(response.data);
            if (response.data.token) {
                console.log('Storing token:', response.data.token);
                localStorage.setItem('token', response.data.token);
            } else { 
                console.error('No token found in response'); 
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    register: async (email, fullName, password) => {
        const response = await api.post('/auth/register/', { email, full_name: fullName, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    }
};

export const walletService = {
    getBalance: async () => {
        const response = await api.get('/wallet/balance/');
        return response.data;
    },

    deposit: async (amount) => {
        const response = await api.post('/wallet/deposit/', { amount });
        return response.data;
    },

    withdraw: async (amount) => {
        const response = await api.post('/wallet/withdraw/', { amount });
        return response.data;
    },

    getTransactions: async () => {
        const response = await api.get('/wallet/');
        return response.data;
    }
};