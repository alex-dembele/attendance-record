// Fichier: frontend/src/app/(app)/leaves/manage/page.tsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import PendingRequestsList from '@/components/leaves/PendingRequestsList';

export default function ManageLeavesPage() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPendingRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/leaves/pending');
      setPendingRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch pending requests", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  return (
    <div className="p-4 md:p-8 h-full">
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-white mb-8"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
      >
        Gérer les Demandes
      </motion.h1>
      {isLoading ? <p>Chargement...</p> : <PendingRequestsList requests={pendingRequests} onAction={fetchPendingRequests} />}
    </div>
  );
}