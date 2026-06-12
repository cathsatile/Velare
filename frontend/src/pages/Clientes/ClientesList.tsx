import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import Header from '../../components/layout/Header';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ClienteForm from './ClienteForm';
import { getClientes, deleteCliente } from '../../api/clientes';
import { useAuth } from '../../context/AuthContext';
import { formatCPF } from '../../utils/formatters';
import toast from 'react-hot-toast';
import type { Cliente } from '../../types';

export default function ClientesList() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCliente, setDeletingCliente] = useState<Cliente | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => { loadClientes(); }, []);

  async function loadClientes() {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  }

  const filteredClientes = useMemo(() => {
    const term = search.toLowerCase();
    return clientes.filter((c) => c.nome.toLowerCase().includes(term) || c.cpf.replace(/\D/g, '').includes(term.replace(/\D/g, '')));
  }, [clientes, search]);

  function handleOpenCreate() { setEditingCliente(null); setModalOpen(true); }
  function handleOpenEdit(cliente: Cliente) { setEditingCliente(cliente); setModalOpen(true); }
  function handleOpenDelete(cliente: Cliente) { setDeletingCliente(cliente); setDeleteDialogOpen(true); }

  async function handleConfirmDelete() {
    if (!deletingCliente) return;
    setDeleteLoading(true);
    try {
      await deleteCliente(deletingCliente.id);
      toast.success('Cliente excluido com sucesso');
      setClientes((prev) => prev.filter((c) => c.id !== deletingCliente.id));
      setDeleteDialogOpen(false);
      setDeletingCliente(null);
    } catch {
      // Error handled by interceptor
    } finally {
      setDeleteLoading(false);
    }
  }

  function handleFormSuccess(cliente: Cliente) {
    if (editingCliente) {
      setClientes((prev) => prev.map((c) => (c.id === cliente.id ? cliente : c)));
    } else {
      setClientes((prev) => [...prev, cliente]);
    }
    setModalOpen(false);
    setEditingCliente(null);
  }

  const columns = [
    { key: 'nome', header: 'Nome' },
    { key: 'cpf', header: 'CPF', render: (c: Cliente) => formatCPF(c.cpf) },
    { key: 'email', header: 'Email' },
    { key: 'telefone', header: 'Telefone' },
    { key: 'endereco', header: 'Endereco' },
    {
      key: 'actions',
      header: 'Acoes',
      render: (c: Cliente) =>
        (
          <div className="flex items-center gap-2">
            <button onClick={() => handleOpenEdit(c)} className="p-2 rounded-lg text-velare-text-muted hover:text-velare-gold hover:bg-velare-gold/10 transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => handleOpenDelete(c)} className="p-2 rounded-lg text-velare-text-muted hover:text-velare-error hover:bg-velare-error/10 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
    },
  ];

  return (
    <div>
      <Header title="Clientes" subtitle="Gerencie os clientes cadastrados" actions={
        <Button onClick={handleOpenCreate}><Plus className="w-4 h-4 mr-2" />Novo Cliente</Button>
      } />

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-velare-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou CPF..."
            className="w-full pl-10 pr-4 py-2 bg-velare-panel border border-velare-border rounded-lg text-velare-text placeholder-velare-text-muted/50 focus:outline-none focus:ring-2 focus:ring-velare-gold focus:border-transparent"
          />
        </div>
      </div>

      <Table columns={columns} data={filteredClientes} keyExtractor={(c) => c.id} loading={loading} emptyMessage="Nenhum cliente encontrado" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCliente ? 'Editar Cliente' : 'Novo Cliente'} size="lg">
        <ClienteForm cliente={editingCliente} onSuccess={handleFormSuccess} />
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Cliente"
        message={`Tem certeza que deseja excluir o cliente "${deletingCliente?.nome}"?`}
        loading={deleteLoading}
      />
    </div>
  );
}
