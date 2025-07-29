// Fichier: frontend/src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface AuthState {
  token: string | null;
  user: object | null; // Nous y mettrons les infos de l'utilisateur plus tard
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: async (email, password) => {
        const response = await api.post('/auth/token', new URLSearchParams({
          username: email,
          password: password,
        }), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const { access_token } = response.data;
        set({ token: access_token, user: { email } }); // User info is placeholder for now
      },
      logout: () => {
        set({ token: null, user: null });
      },
    }),
    {
      name: 'auth-storage', // nom de l'item dans le localStorage
    }
  )
);