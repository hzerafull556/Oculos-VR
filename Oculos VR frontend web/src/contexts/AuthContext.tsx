import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { api, clearAuthToken, getStoredToken, setAuthToken } from '../services/api';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (token: string) => Promise<User>;
  signOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function syncUserFromToken(token: string) {
    setAuthToken(token);

    try {
      const response = await api.get<User>('/users/me');
      setUser(response.data);
      return response.data;
    } catch (error) {
      clearAuthToken();
      setUser(null);
      throw error;
    }
  }

  useEffect(() => {
    async function restoreSession() {
      const token = getStoredToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await syncUserFromToken(token);
      } catch (error) {
        console.error('Erro ao validar token salvo:', error);
      } finally {
        setLoading(false);
      }
    }

    void restoreSession();
  }, []);

  async function signIn(token: string) {
    return syncUserFromToken(token);
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

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
