"use client";
import { LogOut, LayoutDashboard, FileText } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UploadCloud } from "lucide-react";
import { /*...,*/ CalendarCheck } from 'lucide-react';


const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const pathname = usePathname();
  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/reports', label: 'Rapports', icon: FileText },
    { href: '/upload', label: 'Upload', icon: UploadCloud },
    { href: '/leaves', label: 'Permissions', icon: CalendarCheck },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 p-4 text-white bg-slate-900/80 border-r border-white/10 backdrop-blur-lg">
      <h2 className="text-2xl font-bold mb-8">Attendance</h2>
      <nav className="flex flex-col justify-between flex-grow">
        <ul>
          {navLinks.map((link) => (
            <li key={link.href} className="mb-2">
              <Link href={link.href} className={`flex items-center p-2 rounded-lg hover:bg-slate-700/50 ${pathname === link.href ? 'bg-primary-blue text-white' : ''}`}>
                <link.icon className="w-5 h-5 mr-3" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <button onClick={logout} className="flex items-center w-full px-4 py-2 mt-4 text-left text-white bg-red-600/80 rounded-lg hover:bg-red-700/80">
          <LogOut className="w-5 h-5 mr-2" />
          Déconnexion
        </button>
      </nav>
    </aside>
  );
};
export default Sidebar;