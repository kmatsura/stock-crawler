import { create } from 'zustand';

interface AuthState {
  token?: string;
  setToken: (t: string) => void;
  clearToken: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') ?? undefined : undefined,
  setToken: (t) => {
    localStorage.setItem('token', t);
    set({ token: t });
  },
  clearToken: () => {
    localStorage.removeItem('token');
    set({ token: undefined });
  },
}));
