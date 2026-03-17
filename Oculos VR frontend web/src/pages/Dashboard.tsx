import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Settings, Box } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

export function Dashboard() {
  const { user, signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const displayName = user?.full_name || user?.username || user?.email || 'Administrador';

  function handleLogout() {
    signOut();
    // Usamos replace para impedir volta ao dashboard pelo historico do navegador.
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-indigo-600">OculosVR Admin</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <a href="#" className="flex items-center px-3 py-2 bg-indigo-50 text-indigo-700 rounded-md font-medium">
            <Box className="mr-3 h-5 w-5" />
            Dashboard
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md font-medium">
            <UserIcon className="mr-3 h-5 w-5" />
            Usuarios
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md font-medium">
            <Settings className="mr-3 h-5 w-5" />
            Configuracoes VR
          </a>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair do sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Visao Geral</h2>
          <p className="text-gray-500 mt-1">Bem-vindo(a) de volta, {displayName}.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Usuarios Ativos</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">124</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Ambientes VR</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Sessoes Hoje</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">89</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Seus Dados (retornados de /users/me)</h3>
          <pre className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 overflow-x-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </main>
    </div>
  );
}
