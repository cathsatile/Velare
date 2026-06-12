import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import { getClientes } from '../../api/clientes';
import { getProdutos } from '../../api/produtos';
import { createVenda } from '../../api/vendas';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';
import type { Cliente, Produto } from '../../types';

interface ItemVendaTemp {
  produtoId: number;
  produto: Produto;
  quantidade: number;
}

export default function NovaVenda() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [clienteId, setClienteId] = useState('');
  const [itens, setItens] = useState<ItemVendaTemp[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    async function loadData() {
      try {
        const [clientesData, produtosData] = await Promise.all([getClientes(), getProdutos()]);
        setClientes(clientesData);
        setProdutos(produtosData.filter((p) => p.quantidadeEstoque > 0));
      } catch {
        // Error handled by interceptor
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  function handleAddItem() {
    if (!produtoSelecionado) { toast.error('Selecione um produto'); return; }
    const produto = produtos.find((p) => p.id === Number(produtoSelecionado));
    if (!produto) return;

    const existeItem = itens.find((i) => i.produtoId === produto.id);
    const qtdAtual = existeItem ? existeItem.quantidade : 0;

    if (qtdAtual + quantidade > produto.quantidadeEstoque) {
      toast.error(`Quantidade maxima disponivel: ${produto.quantidadeEstoque - qtdAtual}`);
      return;
    }

    if (existeItem) {
      setItens((prev) => prev.map((i) => (i.produtoId === produto.id ? { ...i, quantidade: i.quantidade + quantidade } : i)));
    } else {
      setItens((prev) => [...prev, { produtoId: produto.id, produto, quantidade }]);
    }

    setProdutoSelecionado('');
    setQuantidade(1);
  }

  function handleRemoveItem(produtoId: number) {
    setItens((prev) => prev.filter((i) => i.produtoId !== produtoId));
  }

  function handleUpdateQuantidade(produtoId: number, novaQtd: number) {
    const produto = produtos.find((p) => p.id === produtoId);
    if (!produto) return;

    if (novaQtd <= 0) { handleRemoveItem(produtoId); return; }
    if (novaQtd > produto.quantidadeEstoque) { toast.error(`Quantidade maxima: ${produto.quantidadeEstoque}`); return; }

    setItens((prev) => prev.map((i) => (i.produtoId === produtoId ? { ...i, quantidade: novaQtd } : i)));
  }

  const total = itens.reduce((sum, i) => sum + i.produto.preco * i.quantidade, 0);

  async function handleSubmit() {
    if (!clienteId) { toast.error('Selecione um cliente'); return; }
    if (itens.length === 0) { toast.error('Adicione pelo menos um item'); return; }

    setSubmitting(true);
    try {
      await createVenda({
        clienteId: Number(clienteId),
        itens: itens.map((i) => ({ produtoId: i.produtoId, quantidade: i.quantidade })),
      });
      toast.success('Venda registrada com sucesso');
      navigate('/vendas');
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div>
        <Header title="Nova Venda" />
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-velare-panel rounded-lg" />
          <div className="h-48 bg-velare-panel rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Nova Venda" actions={<Button variant="secondary" onClick={() => navigate('/vendas')}><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-velare-panel border border-velare-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-velare-text mb-4">Adicionar Produtos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-velare-text-muted mb-1.5">Produto</label>
                <select
                  value={produtoSelecionado}
                  onChange={(e) => setProdutoSelecionado(e.target.value)}
                  className="w-full px-3 py-2 bg-velare-bg border border-velare-border rounded-lg text-velare-text focus:outline-none focus:ring-2 focus:ring-velare-gold"
                >
                  <option value="">Selecione um produto</option>
                  {produtos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} - {formatCurrency(p.preco)} (Estoque: {p.quantidadeEstoque})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-velare-text-muted mb-1.5">Quantidade</label>
                <input
                  type="number"
                  min={1}
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-velare-bg border border-velare-border rounded-lg text-velare-text focus:outline-none focus:ring-2 focus:ring-velare-gold"
                />
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={handleAddItem}><Plus className="w-4 h-4 mr-2" />Adicionar Item</Button>
            </div>
          </div>

          <div className="bg-velare-panel border border-velare-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-velare-text mb-4">Itens da Venda</h3>
            {itens.length === 0 ? (
              <p className="text-center text-velare-text-muted py-8">Nenhum item adicionado</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-velare-border">
                      <th className="text-left py-2 text-sm font-medium text-velare-text-muted">Produto</th>
                      <th className="text-center py-2 text-sm font-medium text-velare-text-muted">Preco Unit.</th>
                      <th className="text-center py-2 text-sm font-medium text-velare-text-muted">Qtd</th>
                      <th className="text-right py-2 text-sm font-medium text-velare-text-muted">Subtotal</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itens.map((item) => (
                      <tr key={item.produtoId} className="border-b border-velare-border/50">
                        <td className="py-3 text-sm text-velare-text">{item.produto.nome}</td>
                        <td className="py-3 text-sm text-velare-text-muted text-center">{formatCurrency(item.produto.preco)}</td>
                        <td className="py-3 text-center">
                          <input
                            type="number"
                            min={1}
                            max={item.produto.quantidadeEstoque}
                            value={item.quantidade}
                            onChange={(e) => handleUpdateQuantidade(item.produtoId, Number(e.target.value))}
                            className="w-16 px-2 py-1 bg-velare-bg border border-velare-border rounded text-velare-text text-center text-sm"
                          />
                        </td>
                        <td className="py-3 text-sm text-velare-gold text-right">{formatCurrency(item.produto.preco * item.quantidade)}</td>
                        <td className="py-3">
                          <button onClick={() => handleRemoveItem(item.produtoId)} className="p-1 rounded text-velare-text-muted hover:text-velare-error">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-velare-panel border border-velare-border rounded-xl p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-velare-text mb-4">Resumo</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-velare-text-muted mb-1.5">Cliente</label>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full px-3 py-2 bg-velare-bg border border-velare-border rounded-lg text-velare-text focus:outline-none focus:ring-2 focus:ring-velare-gold"
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map((c) => (<option key={c.id} value={c.id}>{c.nome}</option>))}
                </select>
              </div>

              <div className="border-t border-velare-border pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-velare-text-muted">Itens</span>
                  <span className="text-velare-text">{itens.length}</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-velare-text-muted">Quantidade Total</span>
                  <span className="text-velare-text">{itens.reduce((sum, i) => sum + i.quantidade, 0)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-velare-text">Total</span>
                  <span className="text-velare-gold">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button className="w-full" onClick={handleSubmit} disabled={!clienteId || itens.length === 0} loading={submitting}>
                Registrar Venda
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
