import { create } from 'zustand';

interface AuthState {
  user: any;
  token: string | null;
  login: (user: any, token: string) => void;
  logout: () => void;
}

// Keep it simple for token storage/loading
const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));
