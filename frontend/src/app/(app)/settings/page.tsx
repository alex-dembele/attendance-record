"use client";
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { Save } from 'lucide-react';

type Parameter = {
  key: string;
  value: any;
  description: string | null;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Parameter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchSettings = useCallback(async () => {
    try {
      const response = await api.get('/settings/');
      setSettings(response.data);
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    const settingsToUpdate = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, any>);

    try {
      await api.put('/settings/', settingsToUpdate);
      setStatusMessage('Paramètres sauvegardés avec succès !');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      setStatusMessage('Erreur lors de la sauvegarde.');
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(currentSettings => 
      currentSettings.map(s => s.key === key ? { ...s, value } : s)
    );
  };

  if (isLoading) return <p>Chargement des paramètres...</p>;

  return (
    <div className="p-4 md:p-8 h-full">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Paramètres</h1>
          <button onClick={handleSave} className="flex items-center justify-center py-2 px-4 rounded-md text-white bg-primary-blue hover:opacity-90">
            <Save className="w-4 h-4 mr-2" /> Sauvegarder
          </button>
        </div>
        {statusMessage && <p className="mb-4 text-center text-green-400">{statusMessage}</p>}
      </motion.div>

      <div className="space-y-6">
        {settings.map((param, index) => (
          <motion.div 
            key={param.key}
            className="p-6 bg-glass-dark border border-white/10 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <label htmlFor={param.key} className="block text-lg font-medium text-white">{param.description}</label>
            <input 
              type="text" 
              id={param.key} 
              value={param.value} 
              onChange={(e) => handleSettingChange(param.key, e.target.value)}
              className="w-full mt-2 input-glass"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}