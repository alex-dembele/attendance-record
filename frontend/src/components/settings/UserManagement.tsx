"use client";
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { UserPlus, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type User = { id: string; email: string; role: { name: string } };

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('EMPLOYEE');

  const fetchUsers = useCallback(() => {
    api.get('/users/').then(res => setUsers(res.data));
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/', { email, password, role_name: role, first_name: firstName, last_name: lastName });
      setUsers(currentUsers => [response.data, ...currentUsers]);
      toast.success("Utilisateur créé avec succès !");
      setEmail(''); setPassword(''); setFirstName(''); setLastName('');
    } catch (error) {
      toast.error("Erreur: L'email existe peut-être déjà.");
    }
  };

  const handleDelete = async (userId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
        toast.success("Utilisateur supprimé avec succès.");
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || "Impossible de supprimer l'utilisateur.";
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="p-6 mt-8 bg-glass-dark border border-white/10 rounded-2xl">
      <h2 className="text-xl font-semibold text-white mb-4">Gestion des Utilisateurs</h2>
      <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end mb-8">
        <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
        <Input value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" type="password" required />
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger><SelectValue placeholder="Rôle" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="EMPLOYEE">Employé</SelectItem>
            <SelectItem value="RH">RH</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
        {role === 'EMPLOYEE' && (
          <>
            <Input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Prénom" type="text" required />
            <Input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Nom" type="text" required />
          </>
        )}
        <Button type="submit" className="md:col-start-2 lg:col-start-auto"><UserPlus className="w-4 h-4 mr-2" /> Créer</Button>
      </form>
      <div className="space-y-2">
        {users.map(user => (
          <div key={user.id} className="flex justify-between items-center p-2 bg-slate-700/50 rounded">
            <div>
              <span className="text-white">{user.email}</span>
              <span className="ml-4 px-2 py-1 text-xs text-sky-300 bg-sky-500/20 rounded-full">{user.role.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}