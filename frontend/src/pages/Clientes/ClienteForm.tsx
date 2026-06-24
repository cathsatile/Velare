import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { createCliente, updateCliente } from '../../api/clientes';
import { clienteSchema } from '../../utils/validators';
import { formatCPF, validateCPF } from '../../utils/formatters';
import type { Cliente, ClienteDTO } from '../../types';
import type { z } from 'zod';

type FormData = z.infer<typeof clienteSchema>;

interface ClienteFormProps {
  cliente?: Cliente | null;
  onSuccess: (cliente: Cliente) => void;
}

function getDefaultValues(cliente?: Cliente | null): FormData {
  return {
    nome: cliente?.nome || '',
    cpf: cliente?.cpf ? formatCPF(cliente.cpf) : '',
    email: cliente?.email || '',
    telefone: cliente?.telefone || '',
    endereco: cliente?.endereco || '',
  };
}

export default function ClienteForm({ cliente, onSuccess }: ClienteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: getDefaultValues(cliente),
  });

  useEffect(() => {
    reset(getDefaultValues(cliente));
  }, [cliente, reset]);

  const cpfRegister = register('cpf');

  function handleCPFChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.target.value = formatCPF(e.target.value);
    cpfRegister.onChange(e);
  }

  async function onSubmit(data: FormData) {
    const cpfNumbers = data.cpf.replace(/\D/g, '');

    if (!validateCPF(cpfNumbers)) {
      toast.error('CPF deve conter 11 dígitos');
      return;
    }

    setIsSubmitting(true);

    try {
      const dto: ClienteDTO = {
        ...data,
        cpf: cpfNumbers,
      };

      const result = cliente
        ? await updateCliente(cliente.id, dto)
        : await createCliente(dto);

      toast.success(
        cliente
          ? 'Cliente atualizado com sucesso'
          : 'Cliente cadastrado com sucesso'
      );

      onSuccess(result);
    } catch {
      // Error handled by interceptor
    } finally {
      setIsSubmitting(false);
    }
  }

  function onInvalid(formErrors: unknown) {
    console.log('Erros de validação:', formErrors);
    toast.error('Verifique os campos do formulário');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
      <Input
        label="Nome"
        {...register('nome')}
        error={errors.nome?.message}
        placeholder="Nome completo"
      />

      <Input
        label="CPF"
        name={cpfRegister.name}
        ref={cpfRegister.ref}
        onBlur={cpfRegister.onBlur}
        onChange={handleCPFChange}
        error={errors.cpf?.message}
        placeholder="000.000.000-00"
        maxLength={14}
      />

      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        placeholder="email@exemplo.com"
      />

      <Input
        label="Telefone"
        {...register('telefone')}
        error={errors.telefone?.message}
        placeholder="(00) 00000-0000"
      />

      <Input
        label="Endereço"
        {...register('endereco')}
        error={errors.endereco?.message}
        placeholder="Rua, número, bairro, cidade"
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" loading={isSubmitting}>
          {cliente ? 'Salvar Alterações' : 'Cadastrar Cliente'}
        </Button>
      </div>
    </form>
  );
}