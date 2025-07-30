import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface AuthState {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      login: async (email, password) => {
        const response = await api.post('/auth/token', new URLSearchParams({
          username: email,
          password: password,
        }));
        set({ token: response.data.access_token });
      },
      logout: () => set({ token: null }),
    }),
    { name: 'auth-storage' }
  )
);