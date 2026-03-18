import { Box, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navigationItems = [
  { label: 'Dashboard', icon: Box, isActive: true },
  { label: 'Usuarios', icon: UserIcon, isActive: false },
  { label: 'Configuracoes VR', icon: Settings, isActive: false },
];

const dashboardMetrics = [
  { label: 'Usuarios Ativos', value: '124' },
  { label: 'Ambientes VR', value: '12' },
  { label: 'Sessoes Hoje', value: '89' },
];

export function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.full_name || user?.username || user?.email || 'Administrador';

  function handleLogout() {
    signOut();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <h1 className="text-xl font-bold text-indigo-600">OculosVR Admin</h1>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navigationItems.map(({ label, icon: Icon, isActive }) => (
            <div
              key={label}
              className={`flex items-center rounded-md px-3 py-2 font-medium ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {label}
            </div>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center rounded-md px-3 py-2 font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair do sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Visao Geral</h2>
          <p className="mt-1 text-gray-500">Bem-vindo(a) de volta, {displayName}.</p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {dashboardMetrics.map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">{label}</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Seus Dados (retornados de /users/me)
          </h3>
          <pre className="overflow-x-auto rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </main>
    </div>
  );
}
