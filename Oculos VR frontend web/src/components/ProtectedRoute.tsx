import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FullScreenLoader } from './FullScreenLoader';

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <FullScreenLoader />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
