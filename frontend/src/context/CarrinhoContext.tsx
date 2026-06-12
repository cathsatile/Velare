import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { CarrinhoState, CarrinhoAction, ItemCarrinho } from '../types';

const CARRINHO_KEY = 'velare_carrinho';

function loadState(): CarrinhoState {
  try {
    const stored = sessionStorage.getItem(CARRINHO_KEY);
    return stored ? JSON.parse(stored) : { itens: [], total: 0, quantidadeTotal: 0 };
  } catch {
    return { itens: [], total: 0, quantidadeTotal: 0 };
  }
}

function saveState(state: CarrinhoState) {
  sessionStorage.setItem(CARRINHO_KEY, JSON.stringify(state));
}

function carrinhoReducer(state: CarrinhoState, action: CarrinhoAction): CarrinhoState {
  let newState: CarrinhoState;

  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.itens.findIndex((i) => i.produtoId === action.payload.produtoId);
      let novosItens: ItemCarrinho[];

      if (existingIndex >= 0) {
        const existing = state.itens[existingIndex];
        const novaQtd = Math.min(existing.quantidade + action.payload.quantidade, action.payload.estoqueDisponivel);
        novosItens = state.itens.map((item, idx) => idx === existingIndex ? { ...item, quantidade: novaQtd } : item);
      } else {
        novosItens = [...state.itens, action.payload];
      }

      newState = {
        itens: novosItens,
        total: novosItens.reduce((sum, i) => sum + i.preco * i.quantidade, 0),
        quantidadeTotal: novosItens.reduce((sum, i) => sum + i.quantidade, 0),
      };
      break;
    }

    case 'REMOVE_ITEM': {
      const novosItens = state.itens.filter((i) => i.produtoId !== action.payload.produtoId);
      newState = {
        itens: novosItens,
        total: novosItens.reduce((sum, i) => sum + i.preco * i.quantidade, 0),
        quantidadeTotal: novosItens.reduce((sum, i) => sum + i.quantidade, 0),
      };
      break;
    }

    case 'UPDATE_QTY': {
      const novosItens = state.itens.map((item) =>
        item.produtoId === action.payload.produtoId
          ? { ...item, quantidade: Math.min(action.payload.quantidade, item.estoqueDisponivel) }
          : item
      ).filter((item) => item.quantidade > 0);

      newState = {
        itens: novosItens,
        total: novosItens.reduce((sum, i) => sum + i.preco * i.quantidade, 0),
        quantidadeTotal: novosItens.reduce((sum, i) => sum + i.quantidade, 0),
      };
      break;
    }

    case 'CLEAR_CART':
      newState = { itens: [], total: 0, quantidadeTotal: 0 };
      break;

    default:
      return state;
  }

  saveState(newState);
  return newState;
}

interface CarrinhoContextType {
  state: CarrinhoState;
  addItem: (item: ItemCarrinho) => void;
  removeItem: (produtoId: number) => void;
  updateQty: (produtoId: number, quantidade: number) => void;
  clearCart: () => void;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(carrinhoReducer, null, loadState);

  useEffect(() => { saveState(state); }, [state]);

  const addItem = (item: ItemCarrinho) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (produtoId: number) => dispatch({ type: 'REMOVE_ITEM', payload: { produtoId } });
  const updateQty = (produtoId: number, quantidade: number) => dispatch({ type: 'UPDATE_QTY', payload: { produtoId, quantidade } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CarrinhoContext.Provider value={{ state, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) throw new Error('useCarrinho must be used within CarrinhoProvider');
  return context;
}
