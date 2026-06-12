import { useState, useEffect } from 'react';
import { Eye, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { getVendas } from '../../api/vendas';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import type { VendaResponse } from '../../types';

export default function VendasList() {
  const [vendas, setVendas] = useState<VendaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenda, setSelectedVenda] = useState<VendaResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => { loadVendas(); }, []);

  async function loadVendas() {
    try {
      const data = await getVendas();
      setVendas(data);
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  }

  function handleViewDetails(venda: VendaResponse) {
    setSelectedVenda(venda);
    setModalOpen(true);
  }

  const columns = [
    { key: 'data', header: 'Data', render: (v: VendaResponse) => formatDateTime(v.data) },
    { key: 'clienteNome', header: 'Cliente' },
    { key: 'valorTotal', header: 'Valor Total', render: (v: VendaResponse) => <span className="text-velare-gold font-medium">{formatCurrency(v.valorTotal)}</span> },
    { key: 'itens', header: 'Itens', render: (v: VendaResponse) => <Badge variant="neutral">{v.itens.length} itens</Badge> },
    {
      key: 'actions',
      header: 'Acoes',
      render: (v: VendaResponse) => (
        <button onClick={() => handleViewDetails(v)} className="p-2 rounded-lg text-velare-text-muted hover:text-velare-gold hover:bg-velare-gold/10 transition-colors">
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <Header title="Vendas" subtitle="Historico de vendas realizadas" actions={
        <Link to="/vendas/nova"><Button><Plus className="w-4 h-4 mr-2" />Nova Venda</Button></Link>
      } />

      <Table columns={columns} data={vendas} keyExtractor={(v) => v.id} loading={loading} emptyMessage="Nenhuma venda registrada" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Venda #${selectedVenda?.id}`} size="lg">
        {selectedVenda && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-velare-text-muted">Data</p>
                <p className="text-velare-text">{formatDateTime(selectedVenda.data)}</p>
              </div>
              <div>
                <p className="text-velare-text-muted">Cliente</p>
                <p className="text-velare-text">{selectedVenda.clienteNome}</p>
              </div>
            </div>

            <div className="border-t border-velare-border pt-4">
              <h4 className="text-sm font-semibold text-velare-text mb-3">Itens da Venda</h4>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-velare-border">
                    <th className="text-left py-2 text-sm font-medium text-velare-text-muted">Produto</th>
                    <th className="text-center py-2 text-sm font-medium text-velare-text-muted">Qtd</th>
                    <th className="text-right py-2 text-sm font-medium text-velare-text-muted">Preco Unit.</th>
                    <th className="text-right py-2 text-sm font-medium text-velare-text-muted">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedVenda.itens.map((item) => (
                    <tr key={item.produtoId} className="border-b border-velare-border/50">
                      <td className="py-2 text-sm text-velare-text">{item.produtoNome}</td>
                      <td className="py-2 text-sm text-velare-text text-center">{item.quantidade}</td>
                      <td className="py-2 text-sm text-velare-text-muted text-right">{formatCurrency(item.precoUnitario)}</td>
                      <td className="py-2 text-sm text-velare-gold text-right">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="py-3 text-sm font-semibold text-velare-text text-right">Total:</td>
                    <td className="py-3 text-lg font-bold text-velare-gold text-right">{formatCurrency(selectedVenda.valorTotal)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
