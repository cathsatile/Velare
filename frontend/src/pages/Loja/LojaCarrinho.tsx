import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import CarrinhoItem from '../../components/loja/CarrinhoItem';
import { useCarrinho } from '../../context/CarrinhoContext';
import { formatCurrency } from '../../utils/formatters';

export default function LojaCarrinho() {
  const { state } = useCarrinho();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-display font-bold text-velare-text mb-8">Seu Carrinho</h1>

      {state.itens.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-velare-text-muted mb-6">Seu carrinho esta vazio</p>
          <Link to="/loja/catalogo"><Button>Continuar Comprando</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {state.itens.map((item) => <CarrinhoItem key={item.produtoId} item={item} />)}
            </div>
          </div>

          <div>
            <div className="bg-velare-panel border border-velare-border rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-velare-text mb-4">Resumo do Pedido</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-velare-text-muted">Subtotal</span>
                  <span className="text-velare-text">{formatCurrency(state.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-velare-text-muted">Itens</span>
                  <span className="text-velare-text">{state.quantidadeTotal} produtos</span>
                </div>
              </div>
              <div className="border-t border-velare-border pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-velare-text">Total</span>
                  <span className="text-velare-gold">{formatCurrency(state.total)}</span>
                </div>
              </div>
              <div className="space-y-3">
                <Link to="/loja/checkout" className="block">
                  <Button className="w-full">Finalizar Pedido<ArrowRight className="w-4 h-4 ml-2" /></Button>
                </Link>
                <Link to="/loja/catalogo">
                  <Button variant="secondary" className="w-full"><ArrowLeft className="w-4 h-4 mr-2" />Continuar Comprando</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
