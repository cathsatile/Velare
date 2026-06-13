import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import Header from '../../components/layout/Header';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ProdutoForm from './ProdutoForm';
import { getProdutos, deleteProduto } from '../../api/produtos';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';
import type { Produto } from '../../types';

export default function ProdutosList() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProduto, setDeletingProduto] = useState<Produto | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => { loadProdutos(); }, []);

  async function loadProdutos() {
    try {
      const data = await getProdutos();
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

  function handleOpenCreate() { setEditingProduto(null); setModalOpen(true); }
  function handleOpenEdit(produto: Produto) { setEditingProduto(produto); setModalOpen(true); }
  function handleOpenDelete(produto: Produto) { setDeletingProduto(produto); setDeleteDialogOpen(true); }

  async function handleConfirmDelete() {
    if (!deletingProduto) return;
    setDeleteLoading(true);
    try {
      await deleteProduto(deletingProduto.id);
      toast.success('Produto excluido com sucesso');
      setProdutos((prev) => prev.filter((p) => p.id !== deletingProduto.id));
      setDeleteDialogOpen(false);
      setDeletingProduto(null);
    } catch {
      // Error handled by interceptor
    } finally {
      setDeleteLoading(false);
    }
  }

  function handleFormSuccess(produto: Produto) {
    if (editingProduto) {
      setProdutos((prev) => prev.map((p) => (p.id === produto.id ? produto : p)));
    } else {
      setProdutos((prev) => [...prev, produto]);
    }
    setModalOpen(false);
    setEditingProduto(null);
  }

  function getEstoqueStatus(produto: Produto) {
    if (produto.quantidadeEstoque === 0) return <Badge variant="danger">Sem Estoque</Badge>;
    if (produto.quantidadeEstoque <= produto.estoqueMinimo) return <Badge variant="warning">Estoque Baixo</Badge>;
    return <Badge variant="success">Disponivel</Badge>;
  }

  const columns = [
    {
      key: 'nome',
      header: 'Nome',
      render: (p: Produto) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{p.nome}</span>
          {p.quantidadeEstoque <= p.estoqueMinimo && <AlertTriangle className="w-4 h-4 text-amber-400" />}
        </div>
      ),
    },
    { key: 'descricao', header: 'Descricao', render: (p: Produto) => <span className="text-velare-text-muted truncate max-w-xs block">{p.descricao || '-'}</span> },
    { key: 'preco', header: 'Preco', render: (p: Produto) => <span className="text-velare-gold font-medium">{formatCurrency(p.preco)}</span> },
    {
      key: 'quantidadeEstoque',
      header: 'Estoque',
      render: (p: Produto) => (
        <span>
          {p.quantidadeEstoque}
          {p.quantidadeEstoque <= p.estoqueMinimo && <span className="text-velare-text-muted text-xs ml-1">/ min: {p.estoqueMinimo}</span>}
        </span>
      ),
    },
    { key: 'status', header: 'Status', render: (p: Produto) => getEstoqueStatus(p) },
    {
      key: 'actions',
      header: 'Acoes',
      render: (p: Produto) =>
        (
          <div className="flex items-center gap-2">
            <button onClick={() => handleOpenEdit(p)} className="p-2 rounded-lg text-velare-text-muted hover:text-velare-gold hover:bg-velare-gold/10 transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => handleOpenDelete(p)} className="p-2 rounded-lg text-velare-text-muted hover:text-velare-error hover:bg-velare-error/10 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
    },
  ];

  return (
    <div>
      <Header title="Produtos" subtitle="Gerencie o catalogo de produtos" actions={
        <Button onClick={handleOpenCreate}><Plus className="w-4 h-4 mr-2" />Novo Produto</Button>
      } />

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-velare-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou descricao..."
            className="w-full pl-10 pr-4 py-2 bg-velare-panel border border-velare-border rounded-lg text-velare-text placeholder-velare-text-muted/50 focus:outline-none focus:ring-2 focus:ring-velare-gold focus:border-transparent"
          />
        </div>
      </div>

      <Table columns={columns} data={filteredProdutos} keyExtractor={(p) => p.id} loading={loading} emptyMessage="Nenhum produto encontrado" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingProduto ? 'Editar Produto' : 'Novo Produto'} size="lg">
        <ProdutoForm produto={editingProduto} onSuccess={handleFormSuccess} />
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Produto"
        message={`Tem certeza que deseja excluir o produto "${deletingProduto?.nome}"?`}
        loading={deleteLoading}
      />
    </div>
  );
}
