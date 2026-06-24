import axios from 'axios';

const SERVICE_TOKEN = import.meta.env.VITE_SERVICE_TOKEN || '';

export const lojaApi = axios.create({
  baseURL: 'http://localhost:8080/loja',
  headers: {
    'Content-Type': 'application/json',
  },
});

lojaApi.interceptors.request.use((config) => {
  if (SERVICE_TOKEN) {
    config.headers.Authorization = `Bearer ${SERVICE_TOKEN}`;
  }

  return config;
});

lojaApi.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);