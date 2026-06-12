import { useState } from 'react';
import { Minus, Plus, Trash2, Gem, Check, X } from 'lucide-react';
import { useCarrinho } from '../../context/CarrinhoContext';
import { formatCurrency } from '../../utils/formatters';
import type { ItemCarrinho } from '../../types';

interface CarrinhoItemProps {
  item: ItemCarrinho;
}

export default function CarrinhoItem({ item }: CarrinhoItemProps) {
  const { updateQty, removeItem } = useCarrinho();
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleDecrement() {
    if (item.quantidade > 1) updateQty(item.produtoId, item.quantidade - 1);
  }

  function handleIncrement() {
    if (item.quantidade < item.estoqueDisponivel) updateQty(item.produtoId, item.quantidade + 1);
  }

  const subtotal = item.preco * item.quantidade;

  return (
    <div className="flex items-center gap-3 bg-velare-bg rounded-lg p-3">
      <div className="w-12 h-12 rounded-lg bg-velare-panel flex items-center justify-center flex-shrink-0">
        <Gem className="w-6 h-6 text-velare-gold/60" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-velare-text truncate">{item.nome}</h4>
        <p className="text-xs text-velare-text-muted">{formatCurrency(item.preco)} cada</p>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={handleDecrement} disabled={item.quantidade <= 1} className="w-6 h-6 rounded bg-velare-panel text-velare-text flex items-center justify-center hover:bg-velare-border disabled:opacity-50 disabled:cursor-not-allowed">
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-8 text-center text-sm text-velare-text">{item.quantidade}</span>
        <button onClick={handleIncrement} disabled={item.quantidade >= item.estoqueDisponivel} className="w-6 h-6 rounded bg-velare-panel text-velare-text flex items-center justify-center hover:bg-velare-border disabled:opacity-50 disabled:cursor-not-allowed">
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <div className="text-right">
        <p className="text-sm font-medium text-velare-gold">{formatCurrency(subtotal)}</p>
      </div>

      <div className="flex-shrink-0">
        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <button onClick={() => removeItem(item.produtoId)} className="w-6 h-6 rounded bg-velare-error text-white flex items-center justify-center">
              <Check className="w-3 h-3" />
            </button>
            <button onClick={() => setConfirmDelete(false)} className="w-6 h-6 rounded bg-velare-panel text-velare-text-muted flex items-center justify-center hover:bg-velare-border">
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)} className="p-1 rounded text-velare-text-muted hover:text-velare-error transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
