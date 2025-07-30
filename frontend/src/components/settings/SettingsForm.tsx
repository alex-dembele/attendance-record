"use client";
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Save } from 'lucide-react';

type Parameter = { key: string; value: any; description: string | null; };

export default function SettingsForm() {
  const [settings, setSettings] = useState<Parameter[]>([]);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    api.get('/settings/').then(res => setSettings(res.data));
  }, []);

  const handleSave = async () => {
    const settingsToUpdate = settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
    try {
      await api.put('/settings/', settingsToUpdate);
      setStatusMessage('Paramètres sauvegardés !');
    } catch {
      setStatusMessage('Erreur de sauvegarde.');
    } finally {
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(current => current.map(s => s.key === key ? { ...s, value } : s));
  };

  return (
    <div className="p-6 bg-glass-dark border border-white/10 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Paramètres Généraux</h2>
        <button onClick={handleSave} className="flex items-center py-2 px-4 rounded-md text-white bg-primary-blue hover:opacity-90">
          <Save className="w-4 h-4 mr-2" /> Sauvegarder
        </button>
      </div>
      {statusMessage && <p className="mb-4 text-center text-green-400">{statusMessage}</p>}
      <div className="space-y-4">
        {settings.map(param => (
          <div key={param.key}>
            <label htmlFor={param.key} className="block text-sm font-medium text-slate-300">{param.description}</label>
            <input type="text" id={param.key} value={param.value} onChange={(e) => handleSettingChange(param.key, e.target.value)} className="w-full mt-1 input-glass"/>
          </div>
        ))}
      </div>
    </div>
  );
}