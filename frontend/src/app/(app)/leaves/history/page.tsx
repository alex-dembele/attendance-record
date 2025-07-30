"use client";
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { motion } from 'framer-motion';
// Vous pouvez créer un composant AllRequestsList similaire à PendingRequestsList
// Pour la simplicité, nous mettons la logique ici.

export default function HistoryPage() {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    api.get('/leaves/all').then(res => setRequests(res.data));
  }, []);

  return (
    <div className="p-4 md:p-8 h-full">
      <motion.h1 /* ... */>Historique des Permissions</motion.h1>
      {/* Affichez la liste des 'requests' ici, similaire à la page de gestion */}
    </div>
  );
}