"use client";
import { useState } from 'react';
import api from '@/lib/api';
import { Send } from 'lucide-react';

export default function NewRequestForm({ onNewRequest }: { onNewRequest: () => void }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/leaves/', { start_date: startDate, end_date: endDate, reason });
      setSuccess('Demande envoyée avec succès.');
      setStartDate('');
      setEndDate('');
      setReason('');
      onNewRequest(); // Rafraîchir la liste
    } catch (err) {
      setError('Erreur lors de l\'envoi de la demande.');
    }
  };

  return (
    <div className="p-6 bg-glass-dark border border-white/10 rounded-2xl shadow-lg backdrop-blur-xl">
      <h2 className="text-xl font-semibold text-white mb-4">Nouvelle Demande de Permission</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Inputs pour les dates, raison, etc. */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-slate-300 mb-1">Date de début</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="w-full input-glass"/>
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-slate-300 mb-1">Date de fin</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="w-full input-glass"/>
          </div>
        </div>
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-slate-300 mb-1">Raison</label>
          <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} className="w-full input-glass"></textarea>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && <p className="text-sm text-green-400">{success}</p>}
        <button type="submit" className="w-full md:w-auto flex items-center justify-center py-2 px-4 rounded-md text-white bg-primary-blue hover:opacity-90">
          <Send className="w-4 h-4 mr-2" /> Envoyer
        </button>
      </form>
    </div>
  );
}