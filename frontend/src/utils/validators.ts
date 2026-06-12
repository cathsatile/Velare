import { z } from 'zod';

export const clienteSchema = z.object({
  nome: z.string().min(1, 'Nome e obrigatorio'),
  cpf: z.string().min(14, 'CPF invalido'),
  email: z.string().email('Email invalido'),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
});

export const produtoSchema = z.object({
  nome: z.string().min(1, 'Nome e obrigatorio'),
  descricao: z.string().optional(),
  preco: z.number().min(0, 'Preco deve ser maior ou igual a zero'),
  quantidadeEstoque: z.number().int().min(0, 'Estoque deve ser maior ou igual a zero'),
  estoqueMinimo: z.number().int().min(0, 'Estoque minimo deve ser maior ou igual a zero'),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  senha: z.string().min(1, 'Senha e obrigatoria'),
});
