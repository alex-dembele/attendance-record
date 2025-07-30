// Fichier: frontend/src/components/leaves/PendingRequestsList.tsx
"use client";
import api from '@/lib/api';
import { Check, X } from 'lucide-react';

// ... (le type LeaveRequest peut être importé ou redéfini ici)
type LeaveRequest = { id: string; start_date: string; end_date: string; reason: string | null; employee: { first_name: string; last_name: string } };

export default function PendingRequestsList({ requests, onAction }: { requests: LeaveRequest[], onAction: () => void }) {
  const handleApprove = async (id: string) => {
    await api.post(`/leaves/${id}/approve`);
    onAction();
  };

  const handleReject = async (id: string) => {
    await api.post(`/leaves/${id}/reject`);
    onAction();
  };

  if (!requests.length) return <p className="mt-8 text-center text-slate-400">Aucune demande en attente.</p>

  return (
    <div className="mt-8 space-y-4">
      {requests.map((req) => (
        <div key={req.id} className="p-4 bg-glass-dark border border-white/10 rounded-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-white">{req.employee.first_name} {req.employee.last_name}</p>
              <p className="text-sm text-slate-300">Du {new Date(req.start_date).toLocaleDateString('fr-FR')} au {new Date(req.end_date).toLocaleDateString('fr-FR')}</p>
              <p className="text-sm text-slate-400 mt-1">{req.reason}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleApprove(req.id)} className="p-2 bg-green-500/20 text-green-400 rounded-full hover:bg-green-500/40"><Check size={18} /></button>
              <button onClick={() => handleReject(req.id)} className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/40"><X size={18} /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}