import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Gem, Receipt, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clientes', icon: Users, label: 'Clientes' },
  { to: '/produtos', icon: Gem, label: 'Produtos' },
  { to: '/vendas', icon: Receipt, label: 'Vendas', exact: true },
  { to: '/vendas/relatorio', icon: BarChart3, label: 'Relatorio' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-velare-panel border-r border-velare-border flex flex-col">
      <div className="p-6 border-b border-velare-border">
        <h1 className="text-2xl font-display font-bold text-velare-gold tracking-wide">VELARE</h1>
        <p className="text-xs text-velare-text-muted mt-1">Sistema de Gestao</p>
      </div>

      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${isActive
                ? 'bg-velare-gold/10 text-velare-gold border border-velare-gold/30'
                : 'text-velare-text-muted hover:text-velare-text hover:bg-velare-bg'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-velare-border">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-velare-gold/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-velare-gold">{user?.sub?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-velare-text truncate">{user?.sub}</p>
            <p className="text-xs text-velare-text-muted">{user?.role === 'ROLE_ADMIN' ? 'Administrador' : 'Funcionario'}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-velare-text-muted hover:text-velare-error hover:bg-velare-error/10 transition-colors">
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sair</span>
        </button>
      </div>
    </aside>
  );
}
