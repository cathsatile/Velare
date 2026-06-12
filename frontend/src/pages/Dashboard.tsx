import { useState, useEffect } from 'react';
import { Users, Gem, AlertTriangle, Receipt } from 'lucide-react';
import Header from '../components/layout/Header';
import Badge from '../components/ui/Badge';
import { getClientes } from '../api/clientes';
import { getProdutos } from '../api/produtos';
import { getVendas } from '../api/vendas';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import type { Cliente, Produto, VendaResponse } from '../types';

export default function Dashboard() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [vendas, setVendas] = useState<VendaResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [clientesData, produtosData, vendasData] = await Promise.all([getClientes(), getProdutos(), getVendas()]);
        setClientes(clientesData);
        setProdutos(produtosData);
        setVendas(vendasData.slice(0, 5));
      } catch {
        // Errors handled by interceptor
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const produtosEstoqueBaixo = produtos.filter((p) => p.quantidadeEstoque <= p.estoqueMinimo).length;
  const produtosSemEstoque = produtos.filter((p) => p.quantidadeEstoque === 0).length;

  if (loading) {
    return (
      <div>
        <Header title="Dashboard" />
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-velare-panel rounded-xl" />)}
          </div>
          <div className="h-64 bg-velare-panel rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Dashboard" subtitle="Visao geral do sistema" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-velare-panel border border-velare-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-900/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-velare-text-muted">Total de Clientes</p>
              <p className="text-2xl font-bold text-velare-text">{clientes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-velare-panel border border-velare-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-900/30 flex items-center justify-center">
              <Gem className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-velare-text-muted">Produtos Cadastrados</p>
              <p className="text-2xl font-bold text-velare-text">{produtos.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-velare-panel border border-velare-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-velare-text-muted">Estoque Baixo</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-velare-text">{produtosEstoqueBaixo}</p>
                {produtosSemEstoque > 0 && <span className="text-xs text-velare-error">({produtosSemEstoque} sem estoque)</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-velare-panel border border-velare-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Receipt className="w-5 h-5 text-velare-gold" />
          <h2 className="text-lg font-semibold text-velare-text">Vendas Recentes</h2>
        </div>

        {vendas.length === 0 ? (
          <p className="text-center text-velare-text-muted py-8">Nenhuma venda registrada</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-velare-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-velare-text-muted">Data</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-velare-text-muted">Cliente</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-velare-text-muted">Valor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-velare-text-muted">Itens</th>
                </tr>
              </thead>
              <tbody>
                {vendas.map((venda) => (
                  <tr key={venda.id} className="border-b border-velare-border/50 last:border-0">
                    <td className="py-3 px-4 text-sm text-velare-text">{formatDateTime(venda.data)}</td>
                    <td className="py-3 px-4 text-sm text-velare-text">{venda.clienteNome}</td>
                    <td className="py-3 px-4 text-sm text-velare-gold font-medium">{formatCurrency(venda.valorTotal)}</td>
                    <td className="py-3 px-4 text-sm text-velare-text"><Badge variant="neutral">{venda.itens.length} itens</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
