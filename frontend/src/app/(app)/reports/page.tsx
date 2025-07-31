"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { toast } from "sonner";
import api from '@/lib/api';

// Importer les composants shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

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

// Fonctions d'aide
const getDefaultDateRange = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Lundi
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  };
};

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
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState(getDefaultDateRange());

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ start_date: filters.startDate, end_date: filters.endDate, limit: '100' });
      const response = await api.get(`/attendance/reports?${params.toString()}`);
      setSessions(response.data);
    } catch (err) {
      toast.error("Erreur lors de la récupération des rapports.");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
        const params = new URLSearchParams({ start_date: filters.startDate, end_date: filters.endDate });
        const response = await api.get(`/attendance/reports/export?${params.toString()}`, {
            responseType: 'blob',
        });
        saveAs(response.data, `rapport_presence_${filters.startDate}_au_${filters.endDate}.csv`);
        toast.success("Exportation réussie !");
    } catch (error) {
        toast.error("Erreur lors de l'export.");
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 h-full">
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-white mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Rapports de Présence
      </motion.h1>

      <Card className="bg-glass-dark border-white/10 backdrop-blur-xl text-white mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Filtres</CardTitle>
          <Button onClick={handleExport} disabled={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? "Export..." : "Exporter en CSV"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-slate-300">Date de début</Label>
              <Input type="date" name="startDate" id="startDate" value={filters.startDate} onChange={(e) => setFilters(f => ({...f, startDate: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-slate-300">Date de fin</Label>
              <Input type="date" name="endDate" id="endDate" value={filters.endDate} onChange={(e) => setFilters(f => ({...f, endDate: e.target.value}))} />
            </div>
          </div>
        </CardContent>
      </Card>

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
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-slate-800">
                    <TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell>
                  </TableRow>
                ))
              ) : sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <EmptyState 
                      title="Aucun rapport trouvé" 
                      description="Modifiez les filtres ou importez un fichier pour voir des données." 
                    />
                  </TableCell>
                </TableRow>
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