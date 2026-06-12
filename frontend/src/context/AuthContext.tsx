import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { DecodedToken } from '../types';

interface AuthContextType {
  token: string | null;
  user: DecodedToken | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeToken(token: string): DecodedToken | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  const decoded = decodeToken(token);
  if (!decoded) return true;
  return decoded.exp * 1000 < Date.now();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem('velare_token');
    return stored && !isTokenExpired(stored) ? stored : null;
  });

  const [user, setUser] = useState<DecodedToken | null>(() => token ? decodeToken(token) : null);

  useEffect(() => {
    setUser(token ? decodeToken(token) : null);
  }, [token]);

  const login = useCallback((newToken: string) => {
    localStorage.setItem('velare_token', newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('velare_token');
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token && !isTokenExpired(token), isAdmin: user?.role === 'ROLE_ADMIN', login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
