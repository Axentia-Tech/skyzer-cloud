import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,

  login: async (email: string, password: string) => {
    // API call
    console.log('Login:', email);
    set({ token: 'mock-token', user: { email } });
  },

  register: async (email: string, password: string, firstName?: string, lastName?: string) => {
    // API call
    console.log('Register:', email, firstName, lastName);
    set({ token: 'mock-token', user: { email, firstName, lastName } });
  },

  logout: () => {
    set({ token: null, user: null });
  },
}));
