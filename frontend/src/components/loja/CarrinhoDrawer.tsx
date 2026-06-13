import { Fragment } from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import CarrinhoItem from './CarrinhoItem';
import { useCarrinho } from '../../context/CarrinhoContext';
import { formatCurrency } from '../../utils/formatters';

interface CarrinhoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CarrinhoDrawer({ isOpen, onClose }: CarrinhoDrawerProps) {
  const { state } = useCarrinho();

  if (!isOpen) return null;

  return (
    <Fragment>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-velare-panel border-l border-velare-border z-50">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-velare-border">
            <h2 className="text-lg font-display font-semibold text-velare-text">Seu Carrinho</h2>
            <button onClick={onClose} className="p-2 rounded-lg text-velare-text-muted hover:text-velare-text hover:bg-velare-bg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {state.itens.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-velare-border mb-4" />
                <p className="text-velare-text-muted mb-4">Seu carrinho esta vazio</p>
                <Link to="/loja/catalogo" onClick={onClose} className="text-velare-gold hover:underline">Ver catalogo</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {state.itens.map((item) => <CarrinhoItem key={item.produtoId} item={item} />)}
              </div>
            )}
          </div>

          {state.itens.length > 0 && (
            <div className="p-4 border-t border-velare-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-velare-text-muted">Subtotal</span>
                <span className="text-xl font-bold text-velare-gold">{formatCurrency(state.total)}</span>
              </div>
              <Link to="/loja/checkout" onClick={onClose} className="block">
                <Button className="w-full">Finalizar Pedido<ArrowRight className="w-4 h-4 ml-2" /></Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
