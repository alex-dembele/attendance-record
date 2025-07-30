"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';

export default function LoginPage() {
  const [email, setEmail] = useState('rh@example.com');
  const [password, setPassword] = useState('rh_password');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const { x, y } = useMousePosition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gray-100 dark:bg-slate-900">
      <motion.div
        className="pointer-events-none fixed -inset-px rounded-full"
        style={{
          background: `radial-gradient(600px at ${x}px ${y}px, rgba(0, 123, 255, 0.15), transparent 80%)`,
        }}
      />
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-glass-light dark:bg-glass-dark border border-white/20 rounded-2xl shadow-lg backdrop-blur-xl">
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white">Connexion</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                   className="w-full px-3 py-2 mt-1 text-slate-800 bg-white/50 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-slate-900/50 dark:text-white dark:border-white/20"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Mot de passe</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                   className="w-full px-3 py-2 mt-1 text-slate-800 bg-white/50 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-slate-900/50 dark:text-white dark:border-white/20"/>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-blue hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2">
            <LogIn className="w-5 h-5 mr-2" /> Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}