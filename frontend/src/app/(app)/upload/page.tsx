"use client";
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import Uploader from '@/components/upload/Uploader';
import HistoryTable from '@/components/upload/HistoryTable';

export default function UploadPage() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/attendance/imports');
      setHistory(response.data);
    } catch (error) {
      console.error("Failed to fetch import history", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="p-4 md:p-8 h-full">
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-white mb-8"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
      >
        Imports de Fichiers
      </motion.h1>
      <Uploader onUploadSuccess={fetchHistory} />
      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Historique</h2>
      {isLoading ? <p>Chargement de l'historique...</p> : <HistoryTable history={history} />}
    </div>
  );
}