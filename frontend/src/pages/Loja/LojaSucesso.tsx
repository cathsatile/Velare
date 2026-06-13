import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Gem } from 'lucide-react';
import Button from '../../components/ui/Button';
import { getVendaLoja } from '../../api/vendas';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import type { VendaResponse } from '../../types';

export default function LojaSucesso() {
  const [searchParams] = useSearchParams();
  const pedidoId = searchParams.get('pedidoId');
  const [venda, setVenda] = useState<VendaResponse | null>(null);

  const loadVenda = useCallback(async () => {
    if (!pedidoId) return;
    try {
      const data = await getVendaLoja(Number(pedidoId));
      setVenda(data);
    } catch {
      // Error handled
    }
  }, [pedidoId]);

  useEffect(() => { loadVenda(); }, [loadVenda]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 rounded-full bg-velare-gold/20 flex items-center justify-center mx-auto mb-8">
          <Gem className="w-12 h-12 text-velare-gold" />
        </div>

        <h1 className="text-3xl font-display font-bold text-velare-text mb-4">Pedido Confirmado!</h1>
        <p className="text-velare-text-muted mb-8">Obrigada por comprar na Velare. Seu pedido #{pedidoId} foi registrado com sucesso.</p>

        {venda && (
          <div className="bg-velare-panel border border-velare-border rounded-xl p-6 mb-8 text-left">
            <h3 className="text-lg font-semibold text-velare-text mb-4">Detalhes do Pedido</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-velare-text-muted">Data</span>
                <span className="text-velare-text">{formatDateTime(venda.data)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-velare-text-muted">Cliente</span>
                <span className="text-velare-text">{venda.clienteNome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-velare-text-muted">Itens</span>
                <span className="text-velare-text">{venda.itens.length} produtos</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-velare-border">
                <span className="text-velare-text font-medium">Total</span>
                <span className="text-velare-gold font-bold text-lg">{formatCurrency(venda.valorTotal)}</span>
              </div>
            </div>
          </div>
        )}

        <Link to="/loja/catalogo"><Button size="lg">Continuar Comprando</Button></Link>
      </div>
    </div>
  );
}
