"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';

// Importer les composants de graphiques
import AttendanceChart from '@/components/dashboard/AttendanceChart';
import StatusPieChart from '@/components/dashboard/StatusPieChart';

// Importer les composants de carte shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Données statiques pour les cartes KPI
const kpiCards = [
  { title: "Taux de Présence Global", value: "98.7%", icon: Users, description: "Basé sur les 30 derniers jours" },
  { title: "Heures Supp. (Mois)", value: "124h", icon: Clock, description: "Cumul pour le mois en cours" },
  { title: "Alertes de Retard", value: "8", icon: AlertTriangle, description: "Cette semaine" },
];

export default function HomePage() {
  const [summaryData, setSummaryData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    // Récupérer les données pour les graphiques au chargement de la page
    const fetchData = async () => {
      try {
        const [summaryRes, statusRes] = await Promise.all([
          api.get('/dashboard/summary-last-7-days'),
          api.get('/dashboard/status-distribution')
        ]);
        setSummaryData(summaryRes.data);
        setStatusData(statusRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };
    fetchData();
  }, []);

  // Variants pour l'animation des cartes
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="p-4 md:p-8 h-full">
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-white mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Tableau de Bord
      </motion.h1>
      
      {/* Section des Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {kpiCards.map((card, i) => (
          <motion.custom
            key={card.title}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={i}
            // Utilisation du composant Card de shadcn/ui
            component={Card}
            className="bg-glass-dark border-white/10 backdrop-blur-xl text-white"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
              <p className="text-xs text-slate-400 mt-1">{card.description}</p>
            </CardContent>
          </motion.custom>
        ))}
      </div>

      {/* Section des Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.custom
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={3}
            component={Card}
            className="lg:col-span-3 bg-glass-dark border-white/10 backdrop-blur-xl text-white"
        >
          <CardHeader>
            <CardTitle>Présence (7 derniers jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceChart data={summaryData} />
          </CardContent>
        </motion.custom>
        
        <motion.custom
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={4}
            component={Card}
            className="lg:col-span-2 bg-glass-dark border-white/10 backdrop-blur-xl text-white"
        >
          <CardHeader>
            <CardTitle>Répartition des Statuts</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusPieChart data={statusData} />
          </CardContent>
        </motion.custom>
      </div>
    </div>
  );
}