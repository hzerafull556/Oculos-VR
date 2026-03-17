import { createContext, useEffect, useState, ReactNode } from 'react';
import { api, clearAuthToken, getStoredToken, setAuthToken } from '../services/api';
import { User } from '../types';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (token: string, userData: User) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const token = getStoredToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Reaplicamos o token salvo antes de consultar o perfil atual.
        setAuthToken(token);
        const response = await api.get<User>('/users/me');
        setUser(response.data);
      } catch (error) {
        console.error('Erro ao validar token:', error);
        clearAuthToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  function signIn(token: string, userData: User) {
    // O contexto concentra o token e o usuario para o app inteiro.
    setAuthToken(token);
    setUser(userData);
  }

  function signOut() {
    clearAuthToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
