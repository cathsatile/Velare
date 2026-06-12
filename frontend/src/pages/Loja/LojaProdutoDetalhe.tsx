import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Gem } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getProdutoLoja } from '../../api/produtos';
import { useCarrinho } from '../../context/CarrinhoContext';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';
import type { Produto, ItemCarrinho } from '../../types';

export default function LojaProdutoDetalhe() {
  const { id } = useParams();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantidade, setQuantidade] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, state } = useCarrinho();

  const loadProduto = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getProdutoLoja(Number(id));
      setProduto(data);
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadProduto(); }, [loadProduto]);

  function handleDecrement() {
    if (quantidade > 1) setQuantidade((q) => q - 1);
  }

  function handleIncrement() {
    if (produto && quantidade < produto.quantidadeEstoque) setQuantidade((q) => q + 1);
  }

  function handleAddToCart() {
    if (!produto) return;

    const existingItem = state.itens.find((i) => i.produtoId === produto.id);
    const currentQty = existingItem?.quantidade || 0;

    if (currentQty + quantidade > produto.quantidadeEstoque) {
      toast.error('Quantidade maxima disponivel atingida');
      return;
    }

    const item: ItemCarrinho = {
      produtoId: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade,
      estoqueDisponivel: produto.quantidadeEstoque,
    };

    addItem(item);
    toast.success('Adicionado ao carrinho!');
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-velare-panel rounded w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-velare-panel rounded-xl" />
            <div className="space-y-4">
              <div className="h-10 bg-velare-panel rounded w-3/4" />
              <div className="h-6 bg-velare-panel rounded w-1/2" />
              <div className="h-24 bg-velare-panel rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-velare-text-muted">Produto nao encontrado</p>
      </div>
    );
  }

  const semEstoque = produto.quantidadeEstoque === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/loja/catalogo" className="inline-flex items-center gap-2 text-velare-text-muted hover:text-velare-gold mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />Voltar ao catalogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-gradient-to-br from-velare-border to-velare-bg rounded-xl flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-velare-gold/10 flex items-center justify-center">
            <Gem className="w-16 h-16 text-velare-gold/60" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-display font-bold text-velare-text mb-4">{produto.nome}</h1>
          <p className="text-velare-text-muted mb-6">{produto.descricao || 'Joia exclusiva da colecao Velare, desenvolvida com materiais de alta qualidade e acabamento impecavel.'}</p>
          <div className="mb-6">
            <span className="text-3xl font-bold text-velare-gold">{formatCurrency(produto.preco)}</span>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <Badge variant={semEstoque ? 'danger' : produto.quantidadeEstoque <= produto.estoqueMinimo ? 'warning' : 'success'}>
              {semEstoque ? 'Indisponivel' : `${produto.quantidadeEstoque} disponiveis`}
            </Badge>
            {produto.quantidadeEstoque <= produto.estoqueMinimo && !semEstoque && (
              <span className="text-xs text-velare-text-muted">Ultimas unidades</span>
            )}
          </div>

          {!semEstoque && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-velare-text-muted mb-2">Quantidade</label>
              <div className="flex items-center gap-3">
                <button onClick={handleDecrement} disabled={quantidade <= 1} className="w-10 h-10 rounded-lg bg-velare-panel border border-velare-border flex items-center justify-center text-velare-text hover:bg-velare-border disabled:opacity-50 disabled:cursor-not-allowed">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-lg font-medium text-velare-text">{quantidade}</span>
                <button onClick={handleIncrement} disabled={quantidade >= produto.quantidadeEstoque} className="w-10 h-10 rounded-lg bg-velare-panel border border-velare-border flex items-center justify-center text-velare-text hover:bg-velare-border disabled:opacity-50 disabled:cursor-not-allowed">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button size="lg" disabled={semEstoque} onClick={handleAddToCart} className={added ? 'bg-velare-success hover:bg-velare-success' : ''}>
              {added ? 'Adicionado' : 'Adicionar ao Carrinho'}
            </Button>
            {state.itens.length > 0 && (
              <Link to="/loja/checkout"><Button variant="secondary" size="lg">Ver Carrinho</Button></Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
