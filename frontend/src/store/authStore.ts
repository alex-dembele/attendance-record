// Fichier: frontend/src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

// Définir le type pour les informations utilisateur
interface UserProfile {
  email: string;
  role: { name: string };
}

interface AuthState {
  token: string | null;
  user: UserProfile | null; // Utiliser notre nouveau type
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      login: async (email, password) => {
        const response = await api.post('/auth/token', new URLSearchParams({
          username: email,
          password: password,
        }));

        set({ token: response.data.access_token });
        // Après avoir obtenu le token, récupérer les infos de l'utilisateur
        await get().fetchUser();
      },
      fetchUser: async () => {
        try {
          const response = await api.get('/users/me');
          set({ user: response.data });
        } catch (error) {
          console.error("Failed to fetch user", error);
          // Déconnexion si le token est invalide
          set({ token: null, user: null });
        }
      },
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'auth-storage' }
  )
);