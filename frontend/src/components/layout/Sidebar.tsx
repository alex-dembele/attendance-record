"use client";

import { LogOut, LayoutDashboard, FileText, UploadCloud, CalendarCheck, ShieldCheck, History, Settings, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from 'react';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="hidden md:flex flex-col w-64 p-4 text-white bg-slate-900/80 border-r border-white/10 backdrop-blur-lg">
      <div className="flex items-center mb-8">
        <h2 className="text-2xl font-bold">Attendance</h2>
      </div>
      <nav className="flex flex-col justify-between flex-grow">
        <ul className="space-y-2">
          {/* Dashboard Link */}
          <li>
            <Link href="/" className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${isActive('/') ? 'bg-primary-blue text-white' : 'hover:bg-slate-700/50'}`}>
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
          </li>

          {/* Reports Link (Admin/RH) */}
          {(user?.role?.name === 'ADMIN' || user?.role?.name === 'RH') && (
            <li>
              <Link href="/reports" className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${isActive('/reports') ? 'bg-primary-blue text-white' : 'hover:bg-slate-700/50'}`}>
                <FileText className="w-5 h-5 mr-3" />
                Rapports
              </Link>
            </li>
          )}

          {/* Permissions Section */}
          <Collapsible open={isPermissionsOpen} onOpenChange={setIsPermissionsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-slate-700/50 font-medium">
              <div className="flex items-center">
                <CalendarCheck className="w-5 h-5 mr-3" /> Permissions
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isPermissionsOpen ? 'rotate-90' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 pt-2 space-y-2">
              {user?.role?.name === 'EMPLOYEE' && <li><Link href="/leaves" className={`text-sm ${isActive('/leaves') ? 'text-primary-blue font-bold' : 'text-slate-300 hover:text-white'}`}>Mes Demandes</Link></li>}
              {(user?.role?.name === 'ADMIN' || user?.role?.name === 'RH') && <li><Link href="/leaves/manage" className={`text-sm ${isActive('/leaves/manage') ? 'text-primary-blue font-bold' : 'text-slate-300 hover:text-white'}`}>Gérer</Link></li>}
              {(user?.role?.name === 'ADMIN' || user?.role?.name === 'RH') && <li><Link href="/leaves/history" className={`text-sm ${isActive('/leaves/history') ? 'text-primary-blue font-bold' : 'text-slate-300 hover:text-white'}`}>Historique</Link></li>}
            </CollapsibleContent>
          </Collapsible>

          {/* Administration Section (Admin only) */}
          {user?.role?.name === 'ADMIN' && (
            <Collapsible open={isAdminOpen} onOpenChange={setIsAdminOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-slate-700/50 font-medium">
                <div className="flex items-center">
                  <ShieldCheck className="w-5 h-5 mr-3" /> Administration
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isAdminOpen ? 'rotate-90' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 pt-2 space-y-2">
                <li><Link href="/upload" className={`text-sm ${isActive('/upload') ? 'text-primary-blue font-bold' : 'text-slate-300 hover:text-white'}`}>Upload Fichiers</Link></li>
                <li><Link href="/settings" className={`text-sm ${isActive('/settings') ? 'text-primary-blue font-bold' : 'text-slate-300 hover:text-white'}`}>Paramètres</Link></li>
              </CollapsibleContent>
            </Collapsible>
          )}
        </ul>

        {/* Logout Button */}
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