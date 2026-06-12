import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import ProdutoCard from '../../components/loja/ProdutoCard';
import { getProdutosLoja } from '../../api/produtos';
import { useCarrinho } from '../../context/CarrinhoContext';
import toast from 'react-hot-toast';
import type { Produto, ItemCarrinho } from '../../types';

function SkeletonCard() {
  return (
    <div className="bg-velare-panel border border-velare-border rounded-xl overflow-hidden">
      <div className="aspect-square bg-velare-border animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-velare-border rounded animate-pulse w-3/4" />
        <div className="h-4 bg-velare-border rounded animate-pulse w-1/2" />
        <div className="h-10 bg-velare-border rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function LojaCatalogo() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addItem, state } = useCarrinho();

  useEffect(() => { loadProdutos(); }, []);

  async function loadProdutos() {
    try {
      const data = await getProdutosLoja();
      setProdutos(data);
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  }

  const filteredProdutos = useMemo(() => {
    const term = search.toLowerCase();
    return produtos.filter((p) => p.nome.toLowerCase().includes(term) || p.descricao?.toLowerCase().includes(term));
  }, [produtos, search]);

  function handleAddToCart(produto: Produto) {
    const existingItem = state.itens.find((i) => i.produtoId === produto.id);
    const currentQty = existingItem?.quantidade || 0;

    if (currentQty >= produto.quantidadeEstoque) {
      toast.error('Quantidade maxima disponivel atingida');
      return;
    }

    const item: ItemCarrinho = {
      produtoId: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: 1,
      estoqueDisponivel: produto.quantidadeEstoque,
    };

    addItem(item);
    toast.success('Adicionado ao carrinho!');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold text-velare-text mb-4">Nossa Colecao</h1>
        <p className="text-velare-text-muted max-w-2xl mx-auto">Descubra pecas exclusivas que combinam sofisticacao e elegancia para momentos especiais.</p>
      </div>

      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-velare-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produtos..."
            className="w-full pl-12 pr-4 py-3 bg-velare-panel border border-velare-border rounded-xl text-velare-text placeholder-velare-text-muted/50 focus:outline-none focus:ring-2 focus:ring-velare-gold focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredProdutos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-velare-text-muted">Nenhum produto encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProdutos.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
