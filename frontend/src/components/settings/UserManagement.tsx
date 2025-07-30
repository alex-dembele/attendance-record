"use client";
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { UserPlus, Trash2 } from 'lucide-react';
import { toast } from "sonner";

// Définir un type pour les données utilisateur pour plus de clarté
type User = {
  id: string;
  email: string;
  role: {
    name: string;
  };
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fetchUsers = useCallback(() => {
    api.get('/users/').then(res => {
      setUsers(res.data);
    }).catch(err => console.error("Failed to fetch users", err));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      email,
      password,
      role_name: role,
      first_name: role === 'EMPLOYEE' ? firstName : undefined,
      last_name: role === 'EMPLOYEE' ? lastName : undefined,
    };
    try {
      await api.post('/users/', payload);
      toast.success("Utilisateur créé avec succès !");
      // Réinitialiser le formulaire
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      fetchUsers(); // Rafraîchir la liste
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "L'email existe peut-être déjà.";
      toast.error(`Erreur: ${errorMessage}`);
    }
  };

  const handleDelete = async (userId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.")) {
      try {
        await api.delete(`/users/${userId}`);
        toast.success("Utilisateur supprimé avec succès.");
        fetchUsers(); // Rafraîchir la liste
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || "Impossible de supprimer cet utilisateur.";
        toast.error(`Erreur: ${errorMessage}`);
      }
    }
  };

  return (
    <div className="p-6 mt-8 bg-glass-dark border border-white/10 rounded-2xl shadow-lg backdrop-blur-xl">
      <h2 className="text-xl font-semibold text-white mb-4">Gestion des Utilisateurs</h2>
      
      {/* Formulaire de création */}
      <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end mb-8">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required className="input-glass" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" type="password" required className="input-glass" />
        <select value={role} onChange={e => setRole(e.target.value)} className="input-glass">
          <option>EMPLOYEE</option>
          <option>RH</option>
          <option>ADMIN</option>
        </select>
        {role === 'EMPLOYEE' && (
          <>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Prénom" type="text" required className="input-glass" />
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Nom" type="text" required className="input-glass" />
          </>
        )}
        <button type="submit" className="flex items-center justify-center py-2 px-4 rounded-md text-white bg-primary-blue hover:opacity-90 h-10 md:col-start-5">
          <UserPlus className="w-4 h-4 mr-2" /> Créer
        </button>
      </form>

      {/* Liste des utilisateurs */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white/90 border-b border-white/10 pb-2 mb-4">Utilisateurs Existants</h3>
        {users.map(user => (
          <div key={user.id} className="flex justify-between items-center p-2 bg-slate-700/50 rounded hover:bg-slate-700/80 transition-colors">
            <div>
              <span className="text-white">{user.email}</span>
              <span className="ml-4 px-2 py-1 text-xs text-sky-300 bg-sky-500/20 rounded-full">{user.role.name}</span>
            </div>
            <button onClick={() => handleDelete(user.id)} className="p-1 text-red-400 hover:text-red-300 transition-colors" aria-label="Supprimer l'utilisateur">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}