"use client";
import { motion } from 'framer-motion';

type LeaveRequest = {
  id: string;
  start_date: string;
  end_date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason: string | null;
};

const statusStyles = {
  PENDING: 'text-yellow-400',
  APPROVED: 'text-green-400',
  REJECTED: 'text-red-400',
};

export default function RequestsList({ requests }: { requests: LeaveRequest[] }) {
  if (!requests.length) return <p className="mt-8 text-center text-slate-400">Vous n'avez aucune demande de permission.</p>

  return (
    <motion.div 
      className="mt-8 space-y-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      {requests.map((req, i) => (
        <div key={req.id} className="p-4 bg-glass-dark border border-white/10 rounded-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-white">
                Du {new Date(req.start_date).toLocaleDateString('fr-FR')} au {new Date(req.end_date).toLocaleDateString('fr-FR')}
              </p>
              <p className="text-sm text-slate-400 mt-1">{req.reason}</p>
            </div>
            <span className={`font-semibold ${statusStyles[req.status]}`}>{req.status}</span>
          </div>
        </div>
      ))}
    </motion.div>
  );
}