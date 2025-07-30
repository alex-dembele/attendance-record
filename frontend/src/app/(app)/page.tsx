"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';
import AttendanceChart from '@/components/dashboard/AttendanceChart';
import StatusPieChart from '@/components/dashboard/StatusPieChart';
import TopLateEmployees from '@/components/dashboard/TopLateEmployees';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton"; 

export default function HomePage() {
  const [kpiData, setKpiData] = useState(null);
  const [summaryData, setSummaryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [topLate, setTopLate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [kpiRes, summaryRes, statusRes] = await Promise.all([
          api.get('/dashboard/kpis'),
          api.get('/dashboard/summary-last-7-days'),
          api.get('/dashboard/status-distribution')
        ]);
        setKpiData(kpiRes.data.kpis);
        setTopLate(kpiRes.data.top_late_employees);
        setSummaryData(summaryRes.data);
        setStatusData(statusRes.data);
      } catch (error) { console.error("Failed to fetch dashboard data", error); } 
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const kpiCards = [
    { title: "Taux de Présence", value: kpiData ? `${kpiData.attendance_rate}%` : '...', icon: Users },
    { title: "Heures Supp. (Mois)", value: kpiData ? `${kpiData.overtime_hours_month}h` : '...', icon: Clock },
    { title: "Alertes de Retard (Semaine)", value: kpiData ? kpiData.late_alerts_week : '...', icon: AlertTriangle },
  ];

  if (isLoading) {
    return <div className="p-8"><Skeleton className="w-full h-64" /></div> // Affichage de chargement
  }

  return (
    <div className="p-4 md:p-8 h-full">
      <motion.h1 /* ... */>Tableau de Bord</motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {kpiCards.map((card, i) => (
          <Card key={i} className="bg-glass-dark border-white/10 backdrop-blur-xl text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">{card.title}</CardTitle><card.icon/></CardHeader>
            <CardContent><div className="text-3xl font-bold">{card.value}</div></CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-glass-dark border-white/10 backdrop-blur-xl text-white"><CardHeader><CardTitle>Présence (7 derniers jours)</CardTitle></CardHeader><CardContent><AttendanceChart data={summaryData} /></CardContent></Card>
          <Card className="bg-glass-dark border-white/10 backdrop-blur-xl text-white"><CardHeader><CardTitle>Répartition des Statuts</CardTitle></CardHeader><CardContent><StatusPieChart data={statusData} /></CardContent></Card>
        </div>
        <div className="lg:col-span-1">
          <TopLateEmployees employees={topLate} />
        </div>
      </div>
    </div>
  );
}