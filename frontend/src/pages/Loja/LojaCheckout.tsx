import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Gem } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useCarrinho } from '../../context/CarrinhoContext';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';
import type { ItemCarrinho } from '../../types';

export default function LojaCheckout() {
  const navigate = useNavigate();
  const { state, clearCart } = useCarrinho();

  const [step, setStep] = useState<'cpf' | 'confirm'>('cpf');
  const [cpf, setCpf] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function onlyNumbers(value: string): string {
    return String(value || '').replace(/\D/g, '');
  }

  function formatCPFInput(value: string): string {
    const numbers = onlyNumbers(value).slice(0, 11);

    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14);
  }

  function cpfHasElevenDigits(value: string): boolean {
    return onlyNumbers(value).length === 11;
  }

  function handleCPFChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCpf(formatCPFInput(e.target.value));
    setCpfError('');
  }

  function handleVerificarCPF() {
    if (!cpfHasElevenDigits(cpf)) {
      setCpfError('Informe um CPF com 11 dígitos');
      return;
    }

    setCpfError('');
    toast.success('CPF identificado com sucesso');
    setStep('confirm');
  }

  async function handleConfirmarPedido() {
    setSubmitting(true);

    try {
      /*
       * Checkout público simplificado para apresentação.
       * A venda real, com baixa de estoque e relatório, é feita no painel administrativo.
       */
      await new Promise((resolve) => setTimeout(resolve, 500));

      const pedidoId = Date.now();

      clearCart();
      toast.success('Pedido realizado com sucesso');

      navigate(`/loja/sucesso?pedidoId=${pedidoId}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (state.itens.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-velare-text-muted mb-6">
            Seu carrinho está vazio
          </p>

          <Link to="/loja/catalogo">
            <Button>Ver Produtos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-display font-bold text-velare-text mb-8">
        Finalizar Pedido
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 'cpf' && (
            <div className="bg-velare-panel border border-velare-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-velare-text mb-4">
                Identificação
              </h2>

              <p className="text-velare-text-muted mb-6">
                Informe seu CPF para identificar o pedido.
              </p>

              <div className="max-w-sm space-y-4">
                <Input
                  label="CPF"
                  value={cpf}
                  onChange={handleCPFChange}
                  error={cpfError}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />

                <Button onClick={handleVerificarCPF}>
                  Continuar Pedido
                </Button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="bg-velare-panel border border-velare-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-velare-text mb-4">
                Confirmação do Pedido
              </h2>

              <p className="text-velare-text-muted mb-4">
                Confira os itens antes de finalizar.
              </p>

              <div className="mb-4 rounded-lg bg-velare-bg border border-velare-border p-4">
                <p className="text-sm text-velare-text-muted">
                  CPF informado
                </p>

                <p className="text-velare-text font-medium">
                  {cpf}
                </p>
              </div>

              <div className="border border-velare-border rounded-lg overflow-hidden mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="bg-velare-bg">
                      <th className="text-left py-3 px-4 text-sm font-medium text-velare-text-muted">
                        Produto
                      </th>

                      <th className="text-center py-3 px-4 text-sm font-medium text-velare-text-muted">
                        Qtd
                      </th>

                      <th className="text-right py-3 px-4 text-sm font-medium text-velare-text-muted">
                        Preço
                      </th>

                      <th className="text-right py-3 px-4 text-sm font-medium text-velare-text-muted">
                        Subtotal
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {state.itens.map((item: ItemCarrinho) => (
                      <tr
                        key={item.produtoId}
                        className="border-t border-velare-border/50"
                      >
                        <td className="py-3 px-4 text-sm text-velare-text">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-velare-bg flex items-center justify-center">
                              <Gem className="w-5 h-5 text-velare-gold/60" />
                            </div>

                            {item.nome}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-sm text-velare-text text-center">
                          {item.quantidade}
                        </td>

                        <td className="py-3 px-4 text-sm text-velare-text-muted text-right">
                          {formatCurrency(item.preco)}
                        </td>

                        <td className="py-3 px-4 text-sm text-velare-gold text-right">
                          {formatCurrency(item.preco * item.quantidade)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-lg font-bold mb-6">
                <span className="text-velare-text">Total:</span>

                <span className="text-velare-gold">
                  {formatCurrency(state.total)}
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setStep('cpf')}
                  disabled={submitting}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>

                <Button
                  onClick={handleConfirmarPedido}
                  loading={submitting}
                >
                  Finalizar Pedido
                </Button>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-velare-panel border border-velare-border rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-velare-text mb-4">
              Resumo
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-velare-text-muted">Subtotal</span>

                <span className="text-velare-text">
                  {formatCurrency(state.total)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-velare-text-muted">Itens</span>

                <span className="text-velare-text">
                  {state.quantidadeTotal}
                </span>
              </div>
            </div>

            <div className="border-t border-velare-border pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-velare-text">Total</span>

                <span className="text-velare-gold">
                  {formatCurrency(state.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}