import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';

type AuthStore = {
  session: Session | null;
  isGuest: boolean;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  continueAsGuest: () => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  isGuest: false,
  isLoading: true,
  setSession: (session) => set({ session, isLoading: false }),
  continueAsGuest: () => set({ isGuest: true, isLoading: false }),
  signOut: () => set({ session: null, isGuest: false, isLoading: false }),
}));
