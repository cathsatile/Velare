import axios from 'axios';
import toast from 'react-hot-toast';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('velare_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        localStorage.removeItem('velare_token');
        window.location.href = '/login';
      } else if (status === 403) {
        toast.error('Sem permissao para esta acao');
      } else if (status === 400 && data?.message) {
        toast.error(data.message);
      } else if (status >= 500) {
        toast.error('Erro interno do servidor');
      }
    } else {
      toast.error('Erro de conexao');
    }
    return Promise.reject(error);
  }
);
