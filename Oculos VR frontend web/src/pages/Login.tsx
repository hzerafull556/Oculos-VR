import { type FormEvent, useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { api, clearAuthToken, setAuthToken } from '../services/api';
import { AuthResponse, LoginPayload, User } from '../types';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const docsUrl = `${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')}/docs`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload: LoginPayload = { email, password };

      const authResponse = await api.post<AuthResponse>('/auth/login', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { access_token } = authResponse.data;

      // Aplicamos o token antes do /users/me para a API reconhecer a sessao.
      setAuthToken(access_token);

      const userResponse = await api.get<User>('/users/me');
      signIn(access_token, userResponse.data);

      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      clearAuthToken();
      console.error(err);
      const backendMessage = err.response?.data?.detail;
      setError(backendMessage || 'Credenciais invalidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">OculosVR</h1>
          <p className="text-gray-500 mt-2">Acesso Administrativo</p>
        </div>

        <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-lg mb-6 text-sm">
          <p className="font-medium">Primeiro acesso ao MVP?</p>
          <p className="mt-1">
            O cadastro inicial ainda acontece no backend. Crie o usuario em{' '}
            <a
              href={docsUrl}
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline"
            >
              /docs - POST /auth/register
            </a>{' '}
            e depois volte para fazer login aqui.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="voce@exemplo.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="********"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Entrando...' : 'Entrar no Painel'}
          </button>
        </form>
      </div>
    </div>
  );
}
