"use client";
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/80">
          <TabsTrigger value="general">Paramètres Généraux</TabsTrigger>
          <TabsTrigger value="users">Gestion des Utilisateurs</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <SettingsForm />
        </TabsContent>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}