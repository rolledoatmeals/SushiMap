import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const KEY = 'recent_searches';
const MAX_RECENT = 8;

type SearchStore = {
  recentSearches: string[];
  addSearch: (query: string) => void;
  removeSearch: (query: string) => void;
  clearAll: () => void;
  hydrate: () => Promise<void>;
};

async function persist(searches: string[]) {
  await SecureStore.setItemAsync(KEY, JSON.stringify(searches));
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  recentSearches: [],

  addSearch: (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const next = [trimmed, ...get().recentSearches.filter((s) => s !== trimmed)].slice(
      0,
      MAX_RECENT,
    );
    set({ recentSearches: next });
    persist(next);
  },

  removeSearch: (query) => {
    const next = get().recentSearches.filter((s) => s !== query);
    set({ recentSearches: next });
    persist(next);
  },

  clearAll: () => {
    set({ recentSearches: [] });
    SecureStore.deleteItemAsync(KEY);
  },

  hydrate: async () => {
    const raw = await SecureStore.getItemAsync(KEY);
    const searches: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    set({ recentSearches: searches });
  },
}));
