"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';

// Importer les composants du dashboard et de l'UI
import AttendanceChart from '@/components/dashboard/AttendanceChart';
import StatusPieChart from '@/components/dashboard/StatusPieChart';
import TopLateEmployees from '@/components/dashboard/TopLateEmployees';
import AnimatedCounter from '@/components/dashboard/AnimatedCounter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";

// Définir les types de données pour la clarté
type KpiData = {
  attendance_rate: number;
  overtime_hours_month: number;
  late_alerts_week: number;
};

export default function HomePage() {
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [summaryData, setSummaryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [topLate, setTopLate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Exécuter tous les appels API en parallèle pour plus d'efficacité
        const [kpiRes, summaryRes, statusRes] = await Promise.all([
          api.get('/dashboard/kpis'),
          api.get('/dashboard/summary-last-7-days'),
          api.get('/dashboard/status-distribution')
        ]);
        setKpiData(kpiRes.data.kpis);
        setTopLate(kpiRes.data.top_late_employees);
        setSummaryData(summaryRes.data);
        setStatusData(statusRes.data);
      } catch (error) { 
        console.error("Failed to fetch dashboard data", error);
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchData();
  }, []);
  
  const kpiCards = [
    { title: "Taux de Présence", value: kpiData?.attendance_rate, suffix: "%", icon: Users },
    { title: "Heures Supp. (Mois)", value: kpiData?.overtime_hours_month, suffix: "h", icon: Clock },
    { title: "Alertes de Retard (Semaine)", value: kpiData?.late_alerts_week, suffix: "", icon: AlertTriangle },
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {isLoading ? (
          // Skeletons de chargement pour les cartes KPI
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-glass-dark border-white/10 backdrop-blur-xl text-white">
              <CardHeader><Skeleton className="h-5 w-3/4" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-1/2" /></CardContent>
            </Card>
          ))
        ) : (
          // Vraies cartes KPI avec données
          kpiCards.map((card, i) => (
            <Card key={i} className="bg-glass-dark border-white/10 backdrop-blur-xl text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {card.value !== undefined ? <AnimatedCounter value={card.value} /> : '0'}
                  {card.suffix}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Section des Graphiques et Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-glass-dark border-white/10 backdrop-blur-xl text-white">
            <CardHeader><CardTitle>Présence (7 derniers jours)</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-[300px] w-full" /> : <AttendanceChart data={summaryData} />}
            </CardContent>
          </Card>
          <Card className="bg-glass-dark border-white/10 backdrop-blur-xl text-white">
            <CardHeader><CardTitle>Répartition des Statuts</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-[300px] w-full" /> : <StatusPieChart data={statusData} />}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          {isLoading ? <Skeleton className="h-full w-full" /> : <TopLateEmployees employees={topLate} />}
        </div>
      </div>
    </div>
  );
}