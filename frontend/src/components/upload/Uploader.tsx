"use client";
import { useState } from 'react';
import { UploadCloud, File, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

export default function Uploader({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/attendance/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus('success');
      setFile(null);
      onUploadSuccess(); // Rafraîchir la liste
    } catch (err) {
      setStatus('error');
      setError('Échec du téléversement. Veuillez réessayer.');
    }
  };

  return (
    <div className="p-6 bg-glass-dark border border-white/10 rounded-2xl shadow-lg backdrop-blur-xl">
      <h2 className="text-xl font-semibold text-white mb-4">Téléverser un fichier</h2>
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-slate-500 hover:border-primary-blue hover:bg-slate-800/50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
            <p className="mb-1 text-sm text-slate-400">
              <span className="font-semibold">Cliquez</span> ou glissez-déposez
            </p>
            <p className="text-xs text-slate-500">XLSX, XLS ou CSV</p>
          </div>
          <input type="file" className="hidden" onChange={handleFileChange} accept=".xlsx,.xls,.csv"/>
        </label>
      </div>
      {file && (
        <div className="flex items-center justify-between mt-4 text-sm text-white">
          <div className="flex items-center"><File className="w-4 h-4 mr-2" /> {file.name}</div>
          <button onClick={handleUpload} disabled={status === 'uploading'} className="px-4 py-2 text-white rounded-md bg-primary-blue disabled:opacity-50">
            {status === 'uploading' ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>
      )}
      {status === 'error' && <p className="flex items-center mt-2 text-sm text-red-400"><AlertCircle className="w-4 h-4 mr-2" /> {error}</p>}
      {status === 'success' && <p className="mt-2 text-sm text-green-400">Fichier envoyé pour traitement.</p>}
    </div>
  );
}