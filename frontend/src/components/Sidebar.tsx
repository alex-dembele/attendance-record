// Fichier: frontend/src/components/layout/Sidebar.tsx
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  return (
    <aside className="w-64 p-4 text-white bg-gray-800 dark:bg-slate-800">
      <h2 className="text-2xl font-bold mb-8">Attendance</h2>
      <nav className="flex flex-col justify-between h-[calc(100%-64px)]">
        <ul>
          <li className="mb-4"><a href="/" className="hover:text-primary-blue">Dashboard</a></li>
          <li className="mb-4"><a href="/reports" className="hover:text-primary-blue">Rapports</a></li>
        </ul>
        <button onClick={logout} className="flex items-center w-full px-4 py-2 mt-4 text-left text-white bg-red-600 rounded-lg hover:bg-red-700">
          <LogOut className="w-5 h-5 mr-2" />
          Déconnexion
        </button>
      </nav>
    </aside>
  );
};
export default Sidebar;