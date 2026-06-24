import { useState } from 'react';
import { BarChart3, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getRelatorioVendas } from '../../api/vendas';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import type { RelatorioVendas } from '../../types';

function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getToday(): string {
  return formatDateForInput(new Date());
}

function getFirstDayOfCurrentMonth(): string {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  return formatDateForInput(firstDay);
}

function getDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);

  return formatDateForInput(date);
}

function formatDateBR(date: string): string {
  if (!date) return '';

  const [year, month, day] = date.split('-');

  return `${day}/${month}/${year}`;
}

export default function RelatorioVendas() {
  const [inicio, setInicio] = useState(getFirstDayOfCurrentMonth());
  const [fim, setFim] = useState(getToday());
  const [relatorio, setRelatorio] = useState<RelatorioVendas | null>(null);
  const [loading, setLoading] = useState(false);

  function aplicarPeriodoHoje() {
    const hoje = getToday();

    setInicio(hoje);
    setFim(hoje);
  }

  function aplicarUltimos7Dias() {
    setInicio(getDaysAgo(7));
    setFim(getToday());
  }

  function aplicarEsteMes() {
    setInicio(getFirstDayOfCurrentMonth());
    setFim(getToday());
  }

  function aplicarTodos() {
    setInicio('2000-01-01');
    setFim(getToday());
  }

  async function handleGerarRelatorio() {
    if (!inicio || !fim) {
      toast.error('Informe a data inicial e a data final');
      return;
    }

    if (inicio > fim) {
      toast.error('A data inicial não pode ser maior que a data final');
      return;
    }

    setLoading(true);

    try {
      const data = await getRelatorioVendas(inicio, fim);
      setRelatorio(data);

      if (data.vendas.length === 0) {
        toast('Nenhuma venda encontrada nesse período');
      } else {
        toast.success('Relatório gerado com sucesso');
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Header
        title="Relatório de Vendas"
        subtitle="Analise as vendas por período"
      />

      <div className="bg-velare-panel border border-velare-border rounded-xl p-6 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-velare-text-muted mb-1.5">
              Data Início
            </label>

            <input
              type="date"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              className="px-3 py-2 bg-velare-bg border border-velare-border rounded-lg text-velare-text focus:outline-none focus:ring-2 focus:ring-velare-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-velare-text-muted mb-1.5">
              Data Fim
            </label>

            <input
              type="date"
              value={fim}
              onChange={(e) => setFim(e.target.value)}
              className="px-3 py-2 bg-velare-bg border border-velare-border rounded-lg text-velare-text focus:outline-none focus:ring-2 focus:ring-velare-gold"
            />
          </div>

          <Button
            onClick={handleGerarRelatorio}
            loading={loading}
            disabled={!inicio || !fim}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Gerar Relatório
          </Button>
        </div>

        <div className="mt-5">
          <p className="text-sm text-velare-text-muted mb-2">
            Filtros rápidos
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={aplicarPeriodoHoje}
              className="px-3 py-1.5 rounded-lg border border-velare-border text-sm text-velare-text-muted hover:text-velare-gold hover:border-velare-gold transition-colors"
            >
              Hoje
            </button>

            <button
              type="button"
              onClick={aplicarUltimos7Dias}
              className="px-3 py-1.5 rounded-lg border border-velare-border text-sm text-velare-text-muted hover:text-velare-gold hover:border-velare-gold transition-colors"
            >
              Últimos 7 dias
            </button>

            <button
              type="button"
              onClick={aplicarEsteMes}
              className="px-3 py-1.5 rounded-lg border border-velare-border text-sm text-velare-text-muted hover:text-velare-gold hover:border-velare-gold transition-colors"
            >
              Este mês
            </button>

            <button
              type="button"
              onClick={aplicarTodos}
              className="px-3 py-1.5 rounded-lg border border-velare-border text-sm text-velare-text-muted hover:text-velare-gold hover:border-velare-gold transition-colors"
            >
              Todos
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-velare-text-muted">
          <CalendarDays className="w-4 h-4" />
          <span>
            Período selecionado: {formatDateBR(inicio)} a {formatDateBR(fim)}
          </span>
        </div>
      </div>

      {relatorio && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-velare-panel border border-velare-border rounded-xl p-6">
              <p className="text-sm text-velare-text-muted">Período</p>
              <p className="text-lg font-semibold text-velare-text mt-1">
                {formatDateBR(relatorio.inicio)} a {formatDateBR(relatorio.fim)}
              </p>
            </div>

            <div className="bg-velare-panel border border-velare-border rounded-xl p-6">
              <p className="text-sm text-velare-text-muted">
                Quantidade de Vendas
              </p>
              <p className="text-lg font-semibold text-velare-text mt-1">
                {relatorio.quantidadeVendas}
              </p>
            </div>

            <div className="bg-velare-panel border border-velare-border rounded-xl p-6">
              <p className="text-sm text-velare-text-muted">Valor Total</p>
              <p className="text-lg font-semibold text-velare-gold mt-1">
                {formatCurrency(relatorio.valorTotal)}
              </p>
            </div>
          </div>

          <div className="bg-velare-panel border border-velare-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-velare-text mb-4">
              Vendas do Período
            </h3>

            {relatorio.vendas.length === 0 ? (
              <p className="text-center text-velare-text-muted py-8">
                Nenhuma venda no período
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-velare-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-velare-text-muted">
                        Data
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-velare-text-muted">
                        Cliente
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-velare-text-muted">
                        Itens
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-velare-text-muted">
                        Valor
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {relatorio.vendas.map((venda) => (
                      <tr
                        key={venda.id}
                        className="border-b border-velare-border/50"
                      >
                        <td className="py-3 px-4 text-sm text-velare-text">
                          {formatDateTime(venda.data)}
                        </td>

                        <td className="py-3 px-4 text-sm text-velare-text">
                          {venda.clienteNome}
                        </td>

                        <td className="py-3 px-4">
                          <Badge variant="neutral">
                            {venda.itens.length}{' '}
                            {venda.itens.length === 1 ? 'item' : 'itens'}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-sm text-velare-gold font-medium text-right">
                          {formatCurrency(venda.valorTotal)}
                        </td>
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