import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Gem } from 'lucide-react';
import toast from 'react-hot-toast';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../utils/validators';
import type { z } from 'zod';

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
  console.log("🔥 onSubmit disparado");
  console.log("📦 Dados do formulário:", data);

  setLoading(true);
  try {
    const response = await loginApi(data);
    console.log("✅ Resposta da API:", response);

    login(response.token);
    toast.success('Login realizado com sucesso!');
    navigate('/dashboard');
  } catch (error) {
    console.log("❌ Erro na API:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-velare-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-velare-panel border border-velare-border mb-4">
            <Gem className="w-8 h-8 text-velare-gold" />
          </div>
          <h1 className="text-4xl font-display font-bold text-velare-gold tracking-wider">VELARE</h1>
          <p className="text-velare-text-muted mt-2">Sistema de Gestao Comercial</p>
        </div>

        <div className="bg-velare-panel border border-velare-border rounded-xl p-8">
          <h2 className="text-xl font-display font-semibold text-velare-text mb-6">Entrar</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-velare-text-muted mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`w-full px-3 py-2 bg-velare-bg border rounded-lg text-velare-text placeholder-velare-text-muted/50 focus:outline-none focus:ring-2 focus:ring-velare-gold focus:border-transparent transition-all ${
                  errors.email ? 'border-velare-error' : 'border-velare-border'
                }`}
                placeholder="seu@email.com"
              />
              {errors.email && <p className="mt-1 text-sm text-velare-error">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-velare-text-muted mb-1.5">Senha</label>
              <input
                id="senha"
                type="password"
                {...register('senha')}
                className={`w-full px-3 py-2 bg-velare-bg border rounded-lg text-velare-text placeholder-velare-text-muted/50 focus:outline-none focus:ring-2 focus:ring-velare-gold focus:border-transparent transition-all ${
                  errors.senha ? 'border-velare-error' : 'border-velare-border'
                }`}
                placeholder="********"
              />
              {errors.senha && <p className="mt-1 text-sm text-velare-error">{errors.senha.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-velare-gold text-velare-bg font-semibold rounded-lg hover:bg-velare-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-velare-border text-center">
            <Link to="/loja/catalogo" className="text-sm text-velare-text-muted hover:text-velare-gold transition-colors">
              Acessar a loja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
