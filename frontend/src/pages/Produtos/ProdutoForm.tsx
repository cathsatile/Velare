import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { createProduto, updateProduto } from '../../api/produtos';
import { produtoSchema } from '../../utils/validators';
import type { Produto, ProdutoDTO } from '../../types';
import type { z } from 'zod';

type FormData = z.infer<typeof produtoSchema>;

interface ProdutoFormProps {
  produto?: Produto | null;
  onSuccess: (produto: Produto) => void;
}

export default function ProdutoForm({ produto, onSuccess }: ProdutoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: produto?.nome || '',
      descricao: produto?.descricao || '',
      preco: produto?.preco || 0,
      quantidadeEstoque: produto?.quantidadeEstoque || 0,
      estoqueMinimo: produto?.estoqueMinimo || 0,
    },
  });

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    try {
      const dto: ProdutoDTO = {
        ...data,
        preco: Number(data.preco),
        quantidadeEstoque: Number(data.quantidadeEstoque),
        estoqueMinimo: Number(data.estoqueMinimo),
      };
      const result = produto ? await updateProduto(produto.id, dto) : await createProduto(dto);
      toast.success(produto ? 'Produto atualizado com sucesso' : 'Produto cadastrado com sucesso');
      onSuccess(result);
    } catch {
      // Error handled by interceptor
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Nome" {...register('nome')} error={errors.nome?.message} placeholder="Nome do produto" />
      <div>
        <label className="block text-sm font-medium text-velare-text-muted mb-1.5">Descricao</label>
        <textarea {...register('descricao')} rows={3} className="w-full px-3 py-2 bg-velare-bg border border-velare-border rounded-lg text-velare-text placeholder-velare-text-muted/50 focus:outline-none focus:ring-2 focus:ring-velare-gold focus:border-transparent transition-all resize-none" placeholder="Descricao do produto (opcional)" />
      </div>
      <Input label="Preco (R$)" type="number" step="0.01" min="0" {...register('preco', { valueAsNumber: true })} error={errors.preco?.message} placeholder="0.00" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Quantidade em Estoque" type="number" min="0" {...register('quantidadeEstoque', { valueAsNumber: true })} error={errors.quantidadeEstoque?.message} placeholder="0" />
        <Input label="Estoque Minimo" type="number" min="0" {...register('estoqueMinimo', { valueAsNumber: true })} error={errors.estoqueMinimo?.message} placeholder="0" />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" loading={isSubmitting}>{produto ? 'Salvar Alteracoes' : 'Cadastrar Produto'}</Button>
      </div>
    </form>
  );
}
