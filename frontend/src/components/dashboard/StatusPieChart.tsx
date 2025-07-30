"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS: { [key: string]: string } = { ON_TIME: '#22c55e', LATE: '#f59e0b', ABSENT: '#ef4444', ON_LEAVE: '#3b82f6' };

export default function StatusPieChart({ data }: { data: any[] }) {
  const chartData = data.map(d => ({ name: d.status, value: d.count }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}