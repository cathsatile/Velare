import { api } from './axios';
import { lojaApi } from './lojaAxios';
import type { VendaRequest, VendaResponse, RelatorioVendas } from '../types';

export async function getVendas(): Promise<VendaResponse[]> {
  const response = await api.get<VendaResponse[]>('/vendas');
  return response.data;
}

export async function getVendaLoja(id: number): Promise<VendaResponse> {
  const response = await lojaApi.get<VendaResponse>(`/vendas/${id}`);
  return response.data;
}

export async function createVenda(data: VendaRequest): Promise<VendaResponse> {
  const response = await api.post<VendaResponse>('/vendas', data);
  return response.data;
}

export async function createVendaLoja(data: VendaRequest): Promise<VendaResponse> {
  const response = await lojaApi.post<VendaResponse>('/vendas', data);
  return response.data;
}

export async function getRelatorioVendas(inicio: string, fim: string): Promise<RelatorioVendas> {
  const response = await api.get<RelatorioVendas>('/vendas/relatorio', {
    params: { inicio, fim },
  });
  return response.data;
}
