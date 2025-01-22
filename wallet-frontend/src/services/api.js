import axios from 'axios';

const API_URL = 'https://wallet-web-application-zzq9.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// authorization header for protected routes
const token = localStorage.getItem('token');
axios.get('https://wallet-web-application-zzq9.onrender.com/api', {
    headers: {
        Authorization: `access ${token}`,
    },
})
.then((response) => {
    console.log('Dashboard data:', response.data);
})
.catch((error) => {
    console.error('Dashboard request failed:', error);
});


export const authService = {
    login: async (username, password) => {
        try {
            console.log('Attempting to login')
            const response = await api.post('/auth/login/', { username, password });
            console.log(response.data);
            if (response.data.access) {
                console.log('Storing token:', response.data.access);
                localStorage.setItem('token', response.data.access);
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
        if (response.data.access) {
            localStorage.setItem('token', response.data.access);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    }
};

export const walletService = {
    getBalance: async () => {
        try {
            console.log('Making balance request...');
            const response = await api.get('/wallet/balance/');
            console.log('Balance response:', response);
            return response.data;
        } catch (error) {
            console.error('Balance request failed:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                headers: error.response?.headers,
                config: error.config
            });
            throw error;
        }
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
        console.log('Reaching here')
        const response = await api.get('/wallet/');
        return response.data;
    }
};