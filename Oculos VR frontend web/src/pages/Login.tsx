import type { AxiosError } from 'axios';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { FullScreenLoader } from '../components/FullScreenLoader';
import { useAuth } from '../contexts/AuthContext';
import { api, API_DOCS_URL } from '../services/api';
import type { AuthResponse, LoginPayload } from '../types';

interface ApiErrorResponse {
  detail?: string;
}

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload: LoginPayload = { email, password };

      const authResponse = await api.post<AuthResponse>('/auth/login', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await signIn(authResponse.data.access_token);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error(error);
      const backendMessage = (error as AxiosError<ApiErrorResponse>).response?.data?.detail;
      setError(backendMessage || 'Credenciais invalidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">OculosVR</h1>
          <p className="mt-2 text-gray-500">Acesso Administrativo</p>
        </div>

        <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
          <p className="font-medium">Primeiro acesso ao MVP?</p>
          <p className="mt-1">
            O cadastro inicial ainda acontece no backend. Crie o usuario em{' '}
            <a
              href={API_DOCS_URL}
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
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="block w-full rounded-lg border border-gray-300 py-2 pr-3 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="voce@exemplo.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Senha</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="block w-full rounded-lg border border-gray-300 py-2 pr-3 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="********"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
          >
            {isLoading ? 'Entrando...' : 'Entrar no Painel'}
          </button>
        </form>
      </div>
    </div>
  );
}
