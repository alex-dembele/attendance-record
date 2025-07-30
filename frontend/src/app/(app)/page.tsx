// Fichier: frontend/src/app/(app)/page.tsx
"use client";
import { motion } from "framer-motion";
import { Users, Clock, AlertTriangle } from 'lucide-react';

const kpiCards = [
  { title: "Taux de Présence", value: "98.7%", icon: Users, color: "text-green-400" },
  { title: "Heures Supp. (Mois)", value: "124h", icon: Clock, color: "text-sky-400" },
  { title: "Alertes de Retard", value: "8", icon: AlertTriangle, color: "text-yellow-400" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export default function HomePage() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.title}
            className="p-6 bg-glass-dark border border-white/10 rounded-2xl shadow-lg backdrop-blur-xl"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={i}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">{card.title}</p>
                <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
              </div>
              <div className={`p-3 bg-slate-700/50 rounded-full ${card.color}`}>
                <card.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* D'autres composants (graphiques, etc.) pourront être ajoutés ici */}
    </div>
  );
}