"use client";

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { UserPlus, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type User = {
  id: string;
  email: string;
  role: { name: string };
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for the creation form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get('/users/');
      setUsers(response.data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des utilisateurs.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      email,
      password,
      role_name: role,
      first_name: firstName,
      last_name: lastName,
    };

    try {
      const response = await api.post('/users/', userData);
      const newUser = response.data;
      
      setUsers(currentUsers => [newUser, ...currentUsers]);
      toast.success("Utilisateur créé avec succès !");

      // Reset form
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setRole('EMPLOYEE');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Erreur: L'email existe peut-être déjà.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.")) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
        toast.success("Utilisateur supprimé avec succès.");
      } catch (error: any) {
        toast.error(error.response?.data?.detail || "Impossible de supprimer l'utilisateur.");
      }
    }
  };

  return (
    <Card className="mt-8 bg-glass-dark border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">Gestion des Utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        {/* --- Formulaire de création --- */}
        <form onSubmit={handleCreateUser} className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPLOYEE">Employé</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {role === 'EMPLOYEE' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Prénom" type="text" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Nom de famille" type="text" required />
              </div>
            </div>
          )}
          
          <Button type="submit" className="w-full md:w-auto">
            <UserPlus className="w-4 h-4 mr-2" /> Créer l'utilisateur
          </Button>
        </form>

        {/* --- Liste des utilisateurs --- */}
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700 hover:bg-transparent">
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Rôle</TableHead>
              <TableHead className="text-right text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={3} className="text-center">Chargement...</TableCell></TableRow>
            ) : (
              users.map(user => (
                <TableRow key={user.id} className="border-slate-800">
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs text-sky-300 bg-sky-500/20 rounded-full">{user.role.name}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}