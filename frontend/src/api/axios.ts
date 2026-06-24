import axios from 'axios';
import toast from 'react-hot-toast';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function getErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const errorData = data as {
    message?: string;
    mensagem?: string;
    error?: string;
    erro?: string;
  };

  return (
    errorData.message ||
    errorData.mensagem ||
    errorData.erro ||
    errorData.error ||
    null
  );
}

function isDeleteProduto(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const method = error.config?.method?.toLowerCase();
  const url = error.config?.url || '';

  return method === 'delete' && url.includes('/produtos');
}

function isDeleteCliente(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const method = error.config?.method?.toLowerCase();
  const url = error.config?.url || '';

  return method === 'delete' && url.includes('/clientes');
}

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
        toast.error('Sessão expirada. Faça login novamente.');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (status === 403) {
        toast.error('Sem permissão para esta ação.');
        return Promise.reject(error);
      }

      if (isDeleteProduto(error)) {
        toast.error('Produto com vendas registradas não pode ser excluído.');
        return Promise.reject(error);
      }

      if (isDeleteCliente(error)) {
        toast.error('Cliente com vendas registradas não pode ser excluído.');
        return Promise.reject(error);
      }

      const message =
        getErrorMessage(data) || 'Não foi possível concluir a operação.';

      toast.error(message);
    } else {
      toast.error('Não foi possível conectar ao servidor.');
    }

    return Promise.reject(error);
  }
);