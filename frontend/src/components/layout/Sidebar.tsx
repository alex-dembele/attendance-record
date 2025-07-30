"use client";

import { LogOut, LayoutDashboard, FileText, UploadCloud, CalendarCheck, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { /*...,*/ Settings } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'RH', 'EMPLOYEE'] },
    { href: '/reports', label: 'Rapports', icon: FileText, roles: ['ADMIN', 'RH'] },
    { href: '/upload', label: 'Upload', icon: UploadCloud, roles: ['ADMIN'] },
    { href: '/leaves', label: 'Mes Permissions', icon: CalendarCheck, roles: ['EMPLOYEE'] },
    { href: '/leaves/manage', label: 'Gérer Permissions', icon: ShieldCheck, roles: ['ADMIN', 'RH'] },    
    { href: '/leaves/history', label: 'Historique Permissions', icon: FileText , roles: ['ADMIN', 'RH'] },
    { href: '/settings', label: 'Paramètres', icon: Settings, roles: ['ADMIN'] },

  ];

  return (
    <aside className="hidden md:flex flex-col w-64 p-4 text-white bg-slate-900/80 border-r border-white/10 backdrop-blur-lg">
      <h2 className="text-2xl font-bold mb-8">Attendance</h2>
      <nav className="flex flex-col justify-between flex-grow">
        <ul>
          {/* Filtre les liens en fonction du rôle de l'utilisateur connecté */}
          {navLinks
            .filter(link => user?.role?.name && link.roles.includes(user.role.name))
            .map((link) => (
              <li key={link.href} className="mb-2">
                <Link 
                  href={link.href} 
                  className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${pathname === link.href ? 'bg-primary-blue text-white' : 'hover:bg-slate-700/50'}`}
                >
                  <link.icon className="w-5 h-5 mr-3" />
                  {link.label}
                </Link>
              </li>
            ))}
        </ul>
        <button 
          onClick={logout} 
          className="flex items-center w-full px-4 py-2 mt-4 text-left text-white bg-red-600/80 rounded-lg hover:bg-red-700/80 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Déconnexion
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;