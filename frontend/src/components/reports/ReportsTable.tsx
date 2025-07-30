// Fichier: frontend/src/components/reports/ReportsTable.tsx
"use client";
import { motion } from 'framer-motion';

// Définir un type pour les données de session
type WorkSession = {
  session_date: string;
  status: string;
  check_in: string | null;
  check_out: string | null;
  worked_hours_seconds: number;
  notes: string | null;
  employee: {
    first_name: string;
    last_name: string;
    employee_id: string;
  };
};

const ReportsTable = ({ sessions, isLoading }: { sessions: WorkSession[], isLoading: boolean }) => {
  if (isLoading) return <p className="text-center text-white/80">Chargement des données...</p>;
  if (!sessions.length) return <p className="text-center text-white/80">Aucune donnée trouvée pour les filtres sélectionnés.</p>;

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 0) seconds = 0;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m.toString().padStart(2, '0')}m`;
  }

  return (
    <motion.div 
      className="overflow-hidden bg-glass-dark border border-white/10 rounded-2xl shadow-lg backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <table className="min-w-full text-white">
        <thead className="bg-white/10">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Employé</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Statut</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Arrivée</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Départ</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Temps Travaillé</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {sessions.map((session, index) => (
            <tr key={index} className="hover:bg-white/5">
              <td className="px-6 py-4 whitespace-nowrap">{session.employee.first_name} {session.employee.last_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(session.session_date).toLocaleDateString('fr-FR')}</td>
              <td className="px-6 py-4 whitespace-nowrap">{session.status}</td>
              <td className="px-6 py-4 whitespace-nowrap">{formatTime(session.check_in)}</td>
              <td className="px-6 py-4 whitespace-nowrap">{formatTime(session.check_out)}</td>
              <td className="px-6 py-4 whitespace-nowrap">{formatDuration(session.worked_hours_seconds)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ReportsTable;