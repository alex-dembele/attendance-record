// Fichier: frontend/src/app/(app)/reports/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

// Importer les composants shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Définir un type pour les données de session pour plus de clarté
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

// Fonction pour obtenir les dates par défaut (semaine en cours)
const getDefaultDateRange = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Dimanche, 1 = Lundi, ...
  const startDate = new Date(today);
  // Ajuster pour que la semaine commence le Lundi
  startDate.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  };
};

// Fonctions d'aide pour le formatage
const formatTime = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const formatDuration = (seconds: number) => {
  if (seconds < 0) seconds = 0;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m.toString().padStart(2, '0')}m`;
};


export default function ReportsPage() {
  const [sessions, setSessions] = useState<WorkSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(getDefaultDateRange());

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        start_date: filters.startDate,
        end_date: filters.endDate,
        limit: '100',
      });
      const response = await api.get(`/attendance/reports?${params.toString()}`);
      setSessions(response.data);
    } catch (err) {
      setError("Erreur lors de la récupération des rapports.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prevFilters => ({ ...prevFilters, [e.target.name]: e.target.value }));
  };

  return (
    <div className="p-4 md:p-8 h-full">
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-white mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Rapports de Présence
      </motion.h1>

      <Card className="bg-glass-dark border-white/10 backdrop-blur-xl text-white mb-8">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-slate-300">Date de début</Label>
              <Input type="date" name="startDate" id="startDate" value={filters.startDate} onChange={handleFilterChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-slate-300">Date de fin</Label>
              <Input type="date" name="endDate" id="endDate" value={filters.endDate} onChange={handleFilterChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-center text-red-400">{error}</p>}

      <Card className="bg-glass-dark border-white/10 backdrop-blur-xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-transparent">
                <TableHead className="text-white">Employé</TableHead>
                <TableHead className="text-white">Date</TableHead>
                <TableHead className="text-white">Statut</TableHead>
                <TableHead className="text-white">Arrivée</TableHead>
                <TableHead className="text-white">Départ</TableHead>
                <TableHead className="text-white text-right">Temps Travaillé</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center h-24 text-slate-400">Chargement...</TableCell></TableRow>
              ) : sessions.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center h-24 text-slate-400">Aucune donnée trouvée.</TableCell></TableRow>
              ) : (
                sessions.map((session, index) => (
                  <TableRow key={index} className="border-slate-800 text-slate-300">
                    <TableCell className="font-medium text-white">{session.employee.first_name} {session.employee.last_name}</TableCell>
                    <TableCell>{new Date(session.session_date).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>{session.status}</TableCell>
                    <TableCell>{formatTime(session.check_in)}</TableCell>
                    <TableCell>{formatTime(session.check_out)}</TableCell>
                    <TableCell className="text-right">{formatDuration(session.worked_hours_seconds)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}