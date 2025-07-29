// Fichier: frontend/src/app/page.tsx
"use client";
import { useMousePosition } from "@/hooks/useMousePosition";
import { motion } from "framer-motion";

export default function Home() {
  const { x, y } = useMousePosition();
  return (
    <div className="relative flex items-center justify-center w-full min-h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      <motion.div
        className="pointer-events-none fixed -inset-px rounded-full"
        style={{
          background: `radial-gradient(600px at ${x}px ${y}px, rgba(0, 123, 255, 0.15), transparent 80%)`,
        }}
      />
      <div className="relative z-10 p-8 md:p-12 text-center bg-glass-light dark:bg-glass-dark border border-white/20 rounded-2xl shadow-lg backdrop-blur-xl">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
          Bienvenue sur Attendance-record
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          La fondation du frontend est prête.
        </p>
      </div>
    </div>
  );
}
