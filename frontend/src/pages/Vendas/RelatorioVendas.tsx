import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getRelatorioVendas } from '../../api/vendas';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import type { RelatorioVendas } from '../../types';

export default function RelatorioVendas() {
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [relatorio, setRelatorio] = useState<RelatorioVendas | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGerarRelatorio() {
    if (!inicio || !fim) return;
    setLoading(true);
    try {
      const data = await getRelatorioVendas(inicio, fim);
      setRelatorio(data);
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Header title="Relatorio de Vendas" subtitle="Analise de vendas por periodo" />

      <div className="bg-velare-panel border border-velare-border rounded-xl p-6 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-velare-text-muted mb-1.5">Data Inicio</label>
            <input
              type="date"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              className="px-3 py-2 bg-velare-bg border border-velare-border rounded-lg text-velare-text focus:outline-none focus:ring-2 focus:ring-velare-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-velare-text-muted mb-1.5">Data Fim</label>
            <input
              type="date"
              value={fim}
              onChange={(e) => setFim(e.target.value)}
              className="px-3 py-2 bg-velare-bg border border-velare-border rounded-lg text-velare-text focus:outline-none focus:ring-2 focus:ring-velare-gold"
            />
          </div>
          <Button onClick={handleGerarRelatorio} loading={loading} disabled={!inicio || !fim}>
            <BarChart3 className="w-4 h-4 mr-2" />Gerar Relatorio
          </Button>
        </div>
      </div>

      {relatorio && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-velare-panel border border-velare-border rounded-xl p-6">
              <p className="text-sm text-velare-text-muted">Periodo</p>
              <p className="text-lg font-semibold text-velare-text mt-1">{relatorio.inicio} a {relatorio.fim}</p>
            </div>
            <div className="bg-velare-panel border border-velare-border rounded-xl p-6">
              <p className="text-sm text-velare-text-muted">Quantidade de Vendas</p>
              <p className="text-lg font-semibold text-velare-text mt-1">{relatorio.quantidadeVendas}</p>
            </div>
            <div className="bg-velare-panel border border-velare-border rounded-xl p-6">
              <p className="text-sm text-velare-text-muted">Valor Total</p>
              <p className="text-lg font-semibold text-velare-gold mt-1">{formatCurrency(relatorio.valorTotal)}</p>
            </div>
          </div>

          <div className="bg-velare-panel border border-velare-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-velare-text mb-4">Vendas do Periodo</h3>
            {relatorio.vendas.length === 0 ? (
              <p className="text-center text-velare-text-muted py-8">Nenhuma venda no periodo</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-velare-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-velare-text-muted">Data</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-velare-text-muted">Cliente</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-velare-text-muted">Itens</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-velare-text-muted">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatorio.vendas.map((venda) => (
                      <tr key={venda.id} className="border-b border-velare-border/50">
                        <td className="py-3 px-4 text-sm text-velare-text">{formatDateTime(venda.data)}</td>
                        <td className="py-3 px-4 text-sm text-velare-text">{venda.clienteNome}</td>
                        <td className="py-3 px-4"><Badge variant="neutral">{venda.itens.length} itens</Badge></td>
                        <td className="py-3 px-4 text-sm text-velare-gold font-medium text-right">{formatCurrency(venda.valorTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
