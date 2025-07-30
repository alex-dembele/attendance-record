// Fichier: frontend/src/app/(app)/settings/page.tsx
"use client";
import { motion } from 'framer-motion';
import SettingsForm from '@/components/settings/SettingsForm';
import UserManagement from '@/components/settings/UserManagement';

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-8 h-full">
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-white mb-8"
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        Centre de Contrôle
      </motion.h1>

      <SettingsForm />
      <UserManagement />
    </div>
  );
}