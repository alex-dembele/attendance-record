// Fichier: frontend/src/components/settings/UserManagement.tsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { UserPlus, Trash2 } from 'lucide-react';

type User = { id: string; email: string; role: { name: string } };

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const currentUser = useAuthStore((state) => state.user);

  const fetchUsers = useCallback(() => {
    api.get('/users/').then(res => setUsers(res.data));
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users/', { email, password, role_name: role });
      setEmail(''); setPassword('');
      fetchUsers();
    } catch (error) {
      alert("Erreur: L'email existe peut-être déjà.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers(); // Rafraîchir la liste
      } catch (error) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  return (
    <div className="p-6 mt-8 bg-glass-dark border border-white/10 rounded-2xl">
      <h2 className="text-xl font-semibold text-white mb-4">Gestion des Utilisateurs</h2>
      {/* Formulaire de création */}
      <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-8">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required className="input-glass" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" type="password" required className="input-glass" />
        <select value={role} onChange={e => setRole(e.target.value)} className="input-glass">
          <option>EMPLOYEE</option>
          <option>RH</option>
          <option>ADMIN</option>
        </select>
        <button type="submit" className="flex items-center justify-center py-2 px-4 rounded-md text-white bg-primary-blue hover:opacity-90">
          <UserPlus className="w-4 h-4 mr-2" /> Créer
        </button>
      </form>
      {/* Liste des utilisateurs */}
      <div className="space-y-2">
        {users.map(user => (
          <div key={user.id} className="flex justify-between items-center p-2 bg-slate-700/50 rounded">
            <span className="text-white">{user.email}</span>
            <div className="flex items-center gap-4">
              <span className="px-2 py-1 text-xs text-sky-300 bg-sky-500/20 rounded-full">{user.role.name}</span>
              <button 
                onClick={() => handleDeleteUser(user.id)}
                disabled={user.id === currentUser?.id}
                className="p-1 text-red-400 rounded-full hover:bg-red-500/20 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}