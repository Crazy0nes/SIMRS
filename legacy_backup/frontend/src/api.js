import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost/RBPL/api',
  withCredentials: true, // Untuk memastikan session PHP terbaca oleh React
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
