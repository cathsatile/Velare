import { api } from './axios';
import type { Cliente, ClienteDTO } from '../types';

export async function getClientes(): Promise<Cliente[]> {
  const response = await api.get<Cliente[]>('/clientes');
  return response.data;
}

export async function createCliente(data: ClienteDTO): Promise<Cliente> {
  const response = await api.post<Cliente>('/clientes', data);
  return response.data;
}

export async function updateCliente(id: number, data: ClienteDTO): Promise<Cliente> {
  const response = await api.put<Cliente>(`/clientes/${id}`, data);
  return response.data;
}

export async function deleteCliente(id: number): Promise<void> {
  await api.delete(`/clientes/${id}`);
}
