import { api } from './axios';
import type { AuthRequest, AuthResponse } from '../types';

export async function login(data: AuthRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
}
