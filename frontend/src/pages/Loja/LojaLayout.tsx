import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import LojaHeader from '../../components/loja/LojaHeader';
import CarrinhoDrawer from '../../components/loja/CarrinhoDrawer';

export default function LojaLayout() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-velare-bg">
      <LojaHeader onCartClick={() => setCartOpen(true)} />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-velare-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-velare-text-muted">© {new Date().getFullYear()} Velare Joalheria. Todos os direitos reservados.</p>
        </div>
      </footer>
      <CarrinhoDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
