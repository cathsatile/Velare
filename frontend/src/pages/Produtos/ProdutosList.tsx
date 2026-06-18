import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import Header from '../../components/layout/Header';
import Table, { type Column } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ProdutoForm from './ProdutoForm';
import { getProdutos, deleteProduto } from '../../api/produtos';
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

  useEffect(() => {
    loadProdutos();
  }, []);

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
    const normalizarTexto = (value: string | undefined | null) =>
      String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const term = normalizarTexto(search);

    if (!term) {
      return produtos;
    }

    return produtos.filter((produto) => {
      const nome = normalizarTexto(produto.nome);
      const descricao = normalizarTexto(produto.descricao);

      return nome.includes(term) || descricao.includes(term);
    });
  }, [produtos, search]);

  function handleOpenCreate() {
    setEditingProduto(null);
    setModalOpen(true);
  }

  function handleOpenEdit(produto: Produto) {
    setEditingProduto(produto);
    setModalOpen(true);
  }

  function handleOpenDelete(produto: Produto) {
    setDeletingProduto(produto);
    setDeleteDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!deletingProduto) return;

    setDeleteLoading(true);

    try {
      await deleteProduto(deletingProduto.id);
      toast.success('Produto excluído com sucesso');
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
      setProdutos((prev) =>
        prev.map((p) => (p.id === produto.id ? produto : p))
      );
    } else {
      setProdutos((prev) => [...prev, produto]);
    }

    setModalOpen(false);
    setEditingProduto(null);
  }

  function getEstoqueStatus(produto: Produto) {
    if (produto.quantidadeEstoque === 0) {
      return <Badge variant="danger">Sem Estoque</Badge>;
    }

    if (produto.quantidadeEstoque <= produto.estoqueMinimo) {
      return <Badge variant="warning">Estoque Baixo</Badge>;
    }

    return <Badge variant="success">Disponível</Badge>;
  }

  const columns: Column<Produto>[] = [
    {
      key: 'nome',
      header: 'Nome',
      render: (produto: Produto) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{produto.nome}</span>

          {produto.quantidadeEstoque <= produto.estoqueMinimo && (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          )}
        </div>
      ),
    },
    {
      key: 'descricao',
      header: 'Descrição',
      render: (produto: Produto) => (
        <span className="text-velare-text-muted truncate max-w-xs block">
          {produto.descricao || '-'}
        </span>
      ),
    },
    {
      key: 'preco',
      header: 'Preço',
      render: (produto: Produto) => (
        <span className="text-velare-gold font-medium">
          {formatCurrency(produto.preco)}
        </span>
      ),
    },
    {
      key: 'quantidadeEstoque',
      header: 'Estoque',
      render: (produto: Produto) => (
        <span>
          {produto.quantidadeEstoque}

          {produto.quantidadeEstoque <= produto.estoqueMinimo && (
            <span className="text-velare-text-muted text-xs ml-1">
              / min: {produto.estoqueMinimo}
            </span>
          )}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (produto: Produto) => getEstoqueStatus(produto),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (produto: Produto) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(produto)}
            className="p-2 rounded-lg text-velare-text-muted hover:text-velare-gold hover:bg-velare-gold/10 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleOpenDelete(produto)}
            className="p-2 rounded-lg text-velare-text-muted hover:text-velare-error hover:bg-velare-error/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header
        title="Produtos"
        subtitle="Gerencie o catálogo de produtos"
        actions={
          <Button onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        }
      />

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-velare-text-muted" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou descrição..."
            className="w-full pl-10 pr-4 py-2 bg-velare-panel border border-velare-border rounded-lg text-velare-text placeholder-velare-text-muted/50 focus:outline-none focus:ring-2 focus:ring-velare-gold focus:border-transparent"
          />
        </div>
      </div>

      <Table<Produto>
        columns={columns}
        data={filteredProdutos}
        keyExtractor={(produto) => produto.id}
        loading={loading}
        emptyMessage="Nenhum produto encontrado"
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduto ? 'Editar Produto' : 'Novo Produto'}
        size="lg"
      >
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