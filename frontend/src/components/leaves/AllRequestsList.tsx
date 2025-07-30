"use client";
import { motion } from 'framer-motion';

type LeaveRequest = {
  id: string;
  start_date: string;
  end_date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason: string | null;
  employee: {
    first_name: string;
    last_name: string;
  }
};

const statusStyles = {
  PENDING: 'text-yellow-400 border-yellow-400/50',
  APPROVED: 'text-green-400 border-green-400/50',
  REJECTED: 'text-red-400 border-red-400/50',
};

export default function AllRequestsList({ requests }: { requests: LeaveRequest[] }) {
  if (!requests.length) return <p className="mt-8 text-center text-slate-400">Aucune demande n'a été trouvée.</p>

  return (
    <motion.div 
      className="mt-8 space-y-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      {requests.map((req) => (
        <div key={req.id} className="p-4 bg-glass-dark border border-white/10 rounded-xl">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <div>
              <p className="font-bold text-white">{req.employee.first_name} {req.employee.last_name}</p>
              <p className="text-sm text-slate-300">
                Du {new Date(req.start_date).toLocaleDateString('fr-FR')} au {new Date(req.end_date).toLocaleDateString('fr-FR')}
              </p>
              <p className="text-sm text-slate-400 mt-1 italic">{req.reason || "Aucune raison spécifiée"}</p>
            </div>
            <span className={`mt-2 sm:mt-0 font-semibold px-3 py-1 text-xs border rounded-full ${statusStyles[req.status]}`}>
              {req.status}
            </span>
          </div>
        </div>
      ))}
    </motion.div>
  );
}