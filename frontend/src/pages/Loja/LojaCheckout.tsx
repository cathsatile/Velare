import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Gem } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useCarrinho } from '../../context/CarrinhoContext';
import { createVendaLoja } from '../../api/vendas';
import { formatCurrency } from '../../utils/formatters';
import { lojaApi } from '../../api/lojaAxios';
import toast from 'react-hot-toast';
import type { Cliente, ItemCarrinho } from '../../types';

export default function LojaCheckout() {
  const navigate = useNavigate();
  const { state, clearCart } = useCarrinho();
  const [step, setStep] = useState<'cpf' | 'confirm'>('cpf');
  const [cpf, setCpf] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function formatCPFInput(value: string) {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').slice(0, 14);
  }

  function validateCPF(cpfNumbers: string): boolean {
    if (cpfNumbers.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpfNumbers)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpfNumbers[i]) * (10 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpfNumbers[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpfNumbers[i]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpfNumbers[10])) return false;

    return true;
  }

  async function handleVerificarCPF() {
    const cpfNumbers = cpf.replace(/\D/g, '');
    if (!validateCPF(cpfNumbers)) { setCpfError('CPF invalido'); return; }

    setCpfError('');
    setLoading(true);

    try {
      const response = await lojaApi.get<Cliente[]>('/clientes');
      const clienteEncontrado = response.data.find((c) => c.cpf.replace(/\D/g, '') === cpfNumbers);

      if (clienteEncontrado) {
        setCliente(clienteEncontrado);
        setStep('confirm');
      } else {
        toast.error('CPF nao encontrado em nossa base. Para realizar compras online, cadastre-se em nossa loja fisica ou entre em contato conosco.');
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmarPedido() {
    setSubmitting(true);
    try {
      const venda = await createVendaLoja({
        clienteId: cliente!.id,
        itens: state.itens.map((item) => ({ produtoId: item.produtoId, quantidade: item.quantidade })),
      });
      clearCart();
      navigate(`/loja/sucesso?pedidoId=${venda.id}`);
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false);
    }
  }

  if (state.itens.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-velare-text-muted mb-6">Seu carrinho esta vazio</p>
          <Link to="/loja/catalogo"><Button>Ver Produtos</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-display font-bold text-velare-text mb-8">Finalizar Pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 'cpf' && (
            <div className="bg-velare-panel border border-velare-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-velare-text mb-4">Identificacao</h2>
              <p className="text-velare-text-muted mb-6">Para finalizar seu pedido, informe seu CPF cadastrado.</p>

              <div className="max-w-sm space-y-4">
                <Input label="CPF" value={cpf} onChange={(e) => setCpf(formatCPFInput(e.target.value))} error={cpfError} placeholder="000.000.000-00" maxLength={14} />
                <Button onClick={handleVerificarCPF} loading={loading}>Verificar CPF</Button>
              </div>
            </div>
          )}

          {step === 'confirm' && cliente && (
            <div className="bg-velare-panel border border-velare-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-velare-text mb-4">Confirmacao</h2>
              <p className="text-velare-text-muted mb-4">Ola, <span className="text-velare-gold font-medium">{cliente.nome}</span>! Confirme seu pedido:</p>

              <div className="border border-velare-border rounded-lg overflow-hidden mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="bg-velare-bg">
                      <th className="text-left py-3 px-4 text-sm font-medium text-velare-text-muted">Produto</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-velare-text-muted">Qtd</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-velare-text-muted">Preco</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-velare-text-muted">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.itens.map((item: ItemCarrinho) => (
                      <tr key={item.produtoId} className="border-t border-velare-border/50">
                        <td className="py-3 px-4 text-sm text-velare-text">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-velare-bg flex items-center justify-center">
                              <Gem className="w-5 h-5 text-velare-gold/60" />
                            </div>
                            {item.nome}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-velare-text text-center">{item.quantidade}</td>
                        <td className="py-3 px-4 text-sm text-velare-text-muted text-right">{formatCurrency(item.preco)}</td>
                        <td className="py-3 px-4 text-sm text-velare-gold text-right">{formatCurrency(item.preco * item.quantidade)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-lg font-bold mb-6">
                <span className="text-velare-text">Total:</span>
                <span className="text-velare-gold">{formatCurrency(state.total)}</span>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep('cpf')} disabled={submitting}><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
                <Button onClick={handleConfirmarPedido} loading={submitting}>Confirmar Pedido</Button>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-velare-panel border border-velare-border rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-velare-text mb-4">Resumo</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-velare-text-muted">Subtotal</span>
                <span className="text-velare-text">{formatCurrency(state.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-velare-text-muted">Itens</span>
                <span className="text-velare-text">{state.quantidadeTotal}</span>
              </div>
            </div>
            <div className="border-t border-velare-border pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-velare-text">Total</span>
                <span className="text-velare-gold">{formatCurrency(state.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
