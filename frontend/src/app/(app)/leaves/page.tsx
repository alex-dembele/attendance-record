"use client";
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import NewRequestForm from '@/components/leaves/NewRequestForm';
import RequestsList from '@/components/leaves/RequestsList';

export default function LeavesPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/leaves/my-requests');
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch leave requests", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  return (
    <div className="p-4 md:p-8 h-full">
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-white mb-8"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
      >
        Mes Demandes de Permission
      </motion.h1>
      <NewRequestForm onNewRequest={fetchMyRequests} />
      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Historique</h2>
      {isLoading ? <p>Chargement...</p> : <RequestsList requests={requests} />}
    </div>
  );
}