"use client";

import { useState, useCallback } from 'react';
import { UploadCloud, File, LoaderCircle } from 'lucide-react';
import api from '@/lib/api';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Uploader({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile) {
      // Vous pouvez ajouter des validations ici (type, taille, etc.)
      setFile(selectedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files?.[0] ?? null);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files?.[0] ?? null);
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    toast.info("Téléversement en cours...", {
      description: file.name,
    });

    try {
      await api.post('/attendance/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success("Fichier envoyé avec succès !", {
        description: "Le traitement a commencé en arrière-plan.",
      });
      
      setFile(null);
      onUploadSuccess(); // Appelle la fonction pour rafraîchir la liste d'historique
    } catch (err) {
      toast.error("Échec du téléversement", {
        description: "Veuillez vérifier le format du fichier ou votre connexion.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-glass-dark border-white/10 backdrop-blur-xl text-white">
      <CardHeader>
        <CardTitle>Téléverser un fichier de présence</CardTitle>
      </CardHeader>
      <CardContent>
        <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
          <label 
            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${isDragOver ? 'border-primary-blue bg-blue-500/20' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'}`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
              <p className="mb-2 text-sm text-slate-300">
                <span className="font-semibold">Cliquez</span> ou glissez-déposez
              </p>
              <p className="text-xs text-slate-500">Fichiers XLSX, XLS ou CSV</p>
            </div>
            <input type="file" className="hidden" onChange={handleFileChange} accept=".xlsx,.xls,.csv" />
          </label>
        </div>
        
        {file && (
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex items-center text-slate-200 truncate">
              <File className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{file.name}</span>
            </div>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? 'Envoi...' : 'Envoyer'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}