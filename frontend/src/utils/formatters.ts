import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatCPF(cpf: string): string {
  const numbers = String(cpf || '').replace(/\D/g, '').slice(0, 11);

  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .slice(0, 14);
}

export function validateCPF(cpf: string): boolean {
  const numbers = String(cpf || '').replace(/\D/g, '');

  return numbers.length === 11;
}

export function formatDateTime(date: string): string {
  return format(parseISO(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatDate(date: string): string {
  return format(parseISO(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}