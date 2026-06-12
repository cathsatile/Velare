import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from './axios';

const SERVICE_TOKEN = import.meta.env.VITE_SERVICE_TOKEN || '';

export const lojaApi = axios.create({
  baseURL: BASE_URL,
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
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401 || status === 403) {
        toast.error('Servico temporariamente indisponivel');
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
