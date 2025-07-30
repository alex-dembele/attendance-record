import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-800/50 rounded-lg">
      <FolderOpen className="w-12 h-12 text-slate-500 mb-4" />
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}