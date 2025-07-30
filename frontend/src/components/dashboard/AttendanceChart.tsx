"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AttendanceChart({ data }: { data: any[] }) {
  const formattedData = data.map(d => ({
    name: new Date(d.session_date).toLocaleDateString('fr-FR', { weekday: 'short' }),
    Présents: d.present,
    Absents: d.total - d.present,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formattedData}>
        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
        <YAxis stroke="#94a3b8" fontSize={12} />
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }} />
        <Legend />
        <Bar dataKey="Présents" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Absents" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}