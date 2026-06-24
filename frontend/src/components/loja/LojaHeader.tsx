import { Link } from 'react-router-dom';
import { ShoppingBag, Gem, LogIn } from 'lucide-react';
import { useCarrinho } from '../../context/CarrinhoContext';

interface LojaHeaderProps {
  onCartClick?: () => void;
}

export default function LojaHeader({ onCartClick }: LojaHeaderProps) {
  const { state } = useCarrinho();

  return (
    <header className="sticky top-0 z-40 bg-velare-bg/95 backdrop-blur-sm border-b border-velare-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/loja/catalogo" className="flex items-center gap-3">
            <Gem className="w-8 h-8 text-velare-gold" />

            <span className="text-2xl font-display font-bold text-velare-gold tracking-wider">
              VELARE
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-velare-border text-velare-text-muted hover:text-velare-gold hover:border-velare-gold hover:bg-velare-panel transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Área Administrativa
            </Link>

            <button
              type="button"
              onClick={onCartClick}
              className="relative p-2 rounded-lg text-velare-text-muted hover:text-velare-text hover:bg-velare-panel transition-colors"
              title="Carrinho"
            >
              <ShoppingBag className="w-6 h-6" />

              {state.quantidadeTotal > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-velare-gold text-velare-bg text-xs font-bold rounded-full">
                  {state.quantidadeTotal}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}