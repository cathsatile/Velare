// Auth
export interface AuthRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
}

export interface DecodedToken {
  sub: string;
  role: 'ROLE_ADMIN' | 'ROLE_FUNCIONARIO';
  exp: number;
}

// Cliente
export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: string;
}

export interface ClienteDTO {
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  endereco?: string;
}

// Produto
export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidadeEstoque: number;
  estoqueMinimo: number;
}

export interface ProdutoDTO {
  nome: string;
  descricao?: string;
  preco: number;
  quantidadeEstoque: number;
  estoqueMinimo: number;
}

// Venda
export interface ItemVendaRequest {
  produtoId: number;
  quantidade: number;
}

export interface VendaRequest {
  clienteId: number;
  itens: ItemVendaRequest[];
}

export interface ItemVendaResponse {
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface VendaResponse {
  id: number;
  data: string;
  clienteId: number;
  clienteNome: string;
  valorTotal: number;
  itens: ItemVendaResponse[];
}

export interface RelatorioVendas {
  inicio: string;
  fim: string;
  quantidadeVendas: number;
  valorTotal: number;
  vendas: VendaResponse[];
}

// Carrinho (local, sem backend)
export interface ItemCarrinho {
  produtoId: number;
  nome: string;
  preco: number;
  quantidade: number;
  estoqueDisponivel: number;
}

export interface CarrinhoState {
  itens: ItemCarrinho[];
  total: number;
  quantidadeTotal: number;
}

export type CarrinhoAction =
  | { type: 'ADD_ITEM'; payload: ItemCarrinho }
  | { type: 'REMOVE_ITEM'; payload: { produtoId: number } }
  | { type: 'UPDATE_QTY'; payload: { produtoId: number; quantidade: number } }
  | { type: 'CLEAR_CART' };
