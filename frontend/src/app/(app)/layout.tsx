// Fichier: frontend/src/app/(app)/layout.tsx
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Sidebar from '@/components/layout/Sidebar';
import { motion } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const { x, y } = useMousePosition();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  if (!token) return null;

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-slate-900 text-slate-200">
      {/* Fond d'aurore et Spotlight */}
      <div className="absolute inset-0 z-0">
        <div className="aurora-bg"></div>
        <motion.div
          className="pointer-events-none fixed -inset-px"
          style={{
            background: `radial-gradient(600px at ${x}px ${y}px, rgba(0, 123, 255, 0.15), transparent 80%)`,
          }}
        />
      </div>

      {/* Contenu de l'application */}
      <div className="relative z-10 flex w-full">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}