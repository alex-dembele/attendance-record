"use client";
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

type ImportHistoryItem = {
  file_name: string;
  status: string;
  uploaded_at: string;
  uploaded_by: { email: string };
};

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap = {
    COMPLETED: { icon: CheckCircle, color: 'bg-green-500/20 text-green-400', label: 'Terminé' },
    FAILED: { icon: XCircle, color: 'bg-red-500/20 text-red-400', label: 'Échec' },
    PROCESSING: { icon: Clock, color: 'bg-yellow-500/20 text-yellow-400', label: 'En cours' },
    PENDING: { icon: Clock, color: 'bg-sky-500/20 text-sky-400', label: 'En attente' },
  };
  const { icon: Icon, color, label } = statusMap[status as keyof typeof statusMap] || statusMap.PENDING;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3 mr-1.5" />
      {label}
    </span>
  );
};

export default function HistoryTable({ history }: { history: ImportHistoryItem[] }) {
  return (
    <motion.div 
      className="mt-8 overflow-hidden bg-glass-dark border border-white/10 rounded-2xl shadow-lg backdrop-blur-xl"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
    >
      <table className="min-w-full text-white">
        <thead className="bg-white/10">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fichier</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Statut</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Par</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {history.map((item, index) => (
            <tr key={index} className="hover:bg-white/5">
              <td className="px-6 py-4 whitespace-nowrap">{item.file_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(item.uploaded_at).toLocaleString('fr-FR')}</td>
              <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
              <td className="px-6 py-4 whitespace-nowrap">{item.uploaded_by.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}