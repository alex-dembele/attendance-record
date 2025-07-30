"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';
import AttendanceChart from '@/components/dashboard/AttendanceChart';
import StatusPieChart from '@/components/dashboard/StatusPieChart';

export default function HomePage() {
  const [summaryData, setSummaryData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    api.get('/dashboard/summary-last-7-days').then(res => setSummaryData(res.data));
    api.get('/dashboard/status-distribution').then(res => setStatusData(res.data));
  }, []);

  const kpiCards = [
    { title: "Taux de Présence", value: "98.7%", icon: Users },
    { title: "Heures Supp. (Mois)", value: "124h", icon: Clock },
    { title: "Alertes de Retard", value: "8", icon: AlertTriangle },
  ];

  return (
    <div className="p-4 md:p-8 h-full">
      <motion.h1 className="text-3xl md:text-4xl font-bold text-white mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        Tableau de Bord
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {kpiCards.map((card, i) => (
          <motion.div key={card.title} className="p-6 bg-glass-dark border border-white/10 rounded-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            {/* ... contenu des cartes KPI comme avant ... */}
            <p>{card.title}</p><p className="text-3xl font-bold">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div className="p-6 bg-glass-dark border border-white/10 rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 className="text-lg font-semibold text-white mb-4">Présence (7 derniers jours)</h3>
          <AttendanceChart data={summaryData} />
        </motion.div>
        <motion.div className="p-6 bg-glass-dark border border-white/10 rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h3 className="text-lg font-semibold text-white mb-4">Répartition des Statuts</h3>
          <StatusPieChart data={statusData} />
        </motion.div>
      </div>
    </div>
  );
}