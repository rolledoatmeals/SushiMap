import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export type AppearanceMode = 'light' | 'dark' | 'system';

const KEY = 'appearance_mode';

type AppearanceStore = {
  mode: AppearanceMode;
  setMode: (mode: AppearanceMode) => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAppearanceStore = create<AppearanceStore>((set) => ({
  mode: 'system',

  setMode: async (mode) => {
    set({ mode });
    await SecureStore.setItemAsync(KEY, mode);
  },

  hydrate: async () => {
    const raw = await SecureStore.getItemAsync(KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') {
      set({ mode: raw });
    }
  },
}));
