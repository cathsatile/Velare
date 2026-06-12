import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CarrinhoProvider } from './context/CarrinhoContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <CarrinhoProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1F1C1A',
              color: '#F5F0E8',
              border: '1px solid #2E2A27',
            },
            success: {
              iconTheme: { primary: '#4CAF7D', secondary: '#F5F0E8' },
            },
            error: {
              iconTheme: { primary: '#E05C5C', secondary: '#F5F0E8' },
            },
          }}
        />
      </CarrinhoProvider>
    </AuthProvider>
  );
}

export default App;
