// Fichier: frontend/src/components/reports/Filters.tsx
"use client";

interface FiltersProps {
  filters: {
    startDate: string;
    endDate: string;
  };
  onFilterChange: (filters: { startDate: string; endDate: string }) => void;
}

const Filters = ({ filters, onFilterChange }: FiltersProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 mb-8 bg-glass-dark border border-white/10 rounded-2xl shadow-lg backdrop-blur-xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-slate-300 mb-1">Date de début</label>
          <input type="date" name="startDate" id="startDate" value={filters.startDate} onChange={handleChange}
                 className="w-full px-3 py-2 text-white bg-slate-700/50 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue" />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-slate-300 mb-1">Date de fin</label>
          <input type="date" name="endDate" id="endDate" value={filters.endDate} onChange={handleChange}
                 className="w-full px-3 py-2 text-white bg-slate-700/50 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue" />
        </div>
        {/* Le filtre par employé sera ajouté ici plus tard */}
      </div>
    </div>
  );
};

export default Filters;