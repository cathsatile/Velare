import { Gem } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import type { Produto } from '../../types';

interface ProdutoCardProps {
  produto: Produto;
  onAddToCart: (produto: Produto) => void;
}

export default function ProdutoCard({ produto, onAddToCart }: ProdutoCardProps) {
  const semEstoque = produto.quantidadeEstoque === 0;
  const estoqueBaixo = produto.quantidadeEstoque > 0 && produto.quantidadeEstoque <= produto.estoqueMinimo;

  return (
    <div className="group bg-velare-panel border border-velare-border rounded-xl overflow-hidden hover:border-velare-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-velare-gold/5 hover:-translate-y-1">
      <div className="aspect-square bg-gradient-to-br from-velare-border to-velare-bg flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-velare-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Gem className="w-10 h-10 text-velare-gold/60" />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-semibold text-velare-text line-clamp-2">{produto.nome}</h3>
          {semEstoque && <Badge variant="danger">Indisponivel</Badge>}
          {estoqueBaixo && <Badge variant="warning">Ultimas unidades</Badge>}
        </div>

        <p className="text-sm text-velare-text-muted line-clamp-1 mb-3">
          {produto.descricao || 'Joia exclusiva da colecao Velare'}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-velare-gold">{formatCurrency(produto.preco)}</span>
          <Button size="sm" disabled={semEstoque} onClick={() => onAddToCart(produto)}>
            {semEstoque ? 'Indisponivel' : 'Adicionar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
