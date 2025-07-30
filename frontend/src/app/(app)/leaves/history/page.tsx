"use client";
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import AllRequestsList from '@/components/leaves/AllRequestsList';

export default function HistoryPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/leaves/all');
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch history", error);
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
        Historique des Permissions
      </motion.h1>

      {isLoading ? <p className="text-center">Chargement...</p> : <AllRequestsList requests={requests} />}
    </div>
  );
}