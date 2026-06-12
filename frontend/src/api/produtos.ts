import { api } from './axios';
import { lojaApi } from './lojaAxios';
import type { Produto, ProdutoDTO } from '../types';

export async function getProdutos(): Promise<Produto[]> {
  const response = await api.get<Produto[]>('/produtos');
  return response.data;
}

export async function getProdutosLoja(): Promise<Produto[]> {
  const response = await lojaApi.get<Produto[]>('/produtos');
  return response.data;
}

export async function getProdutoLoja(id: number): Promise<Produto> {
  const response = await lojaApi.get<Produto>(`/produtos/${id}`);
  return response.data;
}

export async function createProduto(data: ProdutoDTO): Promise<Produto> {
  const response = await api.post<Produto>('/produtos', data);
  return response.data;
}

export async function updateProduto(id: number, data: ProdutoDTO): Promise<Produto> {
  const response = await api.put<Produto>(`/produtos/${id}`, data);
  return response.data;
}

export async function deleteProduto(id: number): Promise<void> {
  await api.delete(`/produtos/${id}`);
}
