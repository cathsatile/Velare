import { z } from 'zod';

export const clienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),

  cpf: z.string().min(1, 'CPF é obrigatório'),

  email: z.string().email('Email inválido'),

  telefone: z.string().optional(),

  endereco: z.string().optional(),
});

export const produtoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),

  descricao: z.string().optional(),

  preco: z.number().min(0, 'Preço deve ser maior ou igual a zero'),

  quantidadeEstoque: z
    .number()
    .int()
    .min(0, 'Estoque deve ser maior ou igual a zero'),

  estoqueMinimo: z
    .number()
    .int()
    .min(0, 'Estoque mínimo deve ser maior ou igual a zero'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),

  senha: z.string().min(1, 'Senha é obrigatória'),
});