// Fichier: frontend/src/app/(app)/reports/page.tsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import ReportsTable from '@/components/reports/ReportsTable';
import Filters from '@/components/reports/Filters';

// Fonction pour obtenir les dates par défaut (semaine en cours)
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

export default function ReportsPage() {
  const [sessions, setSessions] = useState([]);
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
        limit: '100', // Ajout de la pagination plus tard
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

      <Filters filters={filters} onFilterChange={setFilters} />

      {error && <p className="text-center text-red-400">{error}</p>}

      <ReportsTable sessions={sessions} isLoading={isLoading} />
    </div>
  );
}