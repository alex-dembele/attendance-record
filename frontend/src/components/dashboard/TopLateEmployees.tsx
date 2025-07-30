"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Employee = { first_name: string; last_name: string; late_count: number };

export default function TopLateEmployees({ employees }: { employees: Employee[] }) {
  return (
    <Card className="bg-glass-dark border-white/10 backdrop-blur-xl text-white">
      <CardHeader><CardTitle>Top 5 des retards (Mois)</CardTitle></CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {employees.map((emp, index) => (
            <li key={index} className="flex justify-between items-center text-sm">
              <span className="text-slate-300">{emp.first_name} {emp.last_name}</span>
              <span className="font-bold">{emp.late_count} retards</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}