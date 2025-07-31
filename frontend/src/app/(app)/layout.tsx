"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { useAuthStore } from '@/store/authStore';
import { useMousePosition } from '@/hooks/useMousePosition';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { token, fetchUser } = useAuthStore();
  const router = useRouter();
  const { x, y } = useMousePosition();

  useEffect(() => {
    // Si le token est présent, s'assurer que les infos de l'utilisateur sont chargées
    if (token) {
      fetchUser();
    } else {
      // Sinon, rediriger vers la page de connexion
      router.push('/login');
    }
  }, [token, router, fetchUser]);

  // Pendant la vérification ou la redirection, ne rien afficher pour éviter un flash de contenu
  if (!token) {
    return null;
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-slate-900 text-slate-200">
      {/* ===== Effets Visuels de Fond ===== */}
      <div className="absolute inset-0 z-0">
        {/* Fond d'Aurore Animé */}
        <div className="aurora-bg"></div>
        {/* Curseur Spotlight */}
        <motion.div
          className="pointer-events-none fixed -inset-px"
          style={{
            background: `radial-gradient(600px at ${x}px ${y}px, rgba(0, 123, 255, 0.15), transparent 80%)`,
          }}
        />
      </div>
      
      {/* ===== Contenu de l'Application ===== */}
      <div className="relative z-10 flex w-full">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 overflow-y-auto">
            {/* Le 'template.tsx' enveloppera 'children' pour les animations de page */}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}