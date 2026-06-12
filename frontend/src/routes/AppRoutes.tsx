import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ClientesList from '../pages/Clientes/ClientesList';
import ProdutosList from '../pages/Produtos/ProdutosList';
import VendasList from '../pages/Vendas/VendasList';
import NovaVenda from '../pages/Vendas/NovaVenda';
import RelatorioVendas from '../pages/Vendas/RelatorioVendas';
import LojaLayout from '../pages/Loja/LojaLayout';
import LojaCatalogo from '../pages/Loja/LojaCatalogo';
import LojaProdutoDetalhe from '../pages/Loja/LojaProdutoDetalhe';
import LojaCarrinho from '../pages/Loja/LojaCarrinho';
import LojaCheckout from '../pages/Loja/LojaCheckout';
import LojaSucesso from '../pages/Loja/LojaSucesso';
import PrivateRoute from './PrivateRoute';

const router = createBrowserRouter([
  // Public routes - Loja
  {
    path: '/loja',
    element: <LojaLayout />,
    children: [
      { index: true, element: <Navigate to="/loja/catalogo" replace /> },
      { path: 'catalogo', element: <LojaCatalogo /> },
      { path: 'produto/:id', element: <LojaProdutoDetalhe /> },
      { path: 'carrinho', element: <LojaCarrinho /> },
      { path: 'checkout', element: <LojaCheckout /> },
      { path: 'sucesso', element: <LojaSucesso /> },
    ],
  },
  // Login - Public
  { path: '/login', element: <Login /> },
  // Protected routes - Admin
  {
    element: <PrivateRoute><Layout /></PrivateRoute>,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/clientes', element: <ClientesList /> },
      { path: '/produtos', element: <ProdutosList /> },
      { path: '/vendas', element: <VendasList /> },
      { path: '/vendas/nova', element: <NovaVenda /> },
      { path: '/vendas/relatorio', element: <RelatorioVendas /> },
    ],
  },
  // Redirect root
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
