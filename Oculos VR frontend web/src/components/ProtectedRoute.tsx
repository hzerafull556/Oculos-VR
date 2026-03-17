import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Enquanto verifica o token, mostra um loading simples
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para o login
  // O Outlet renderiza as rotas filhas (ex: Dashboard) se estiver tudo ok
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
