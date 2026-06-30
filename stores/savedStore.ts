import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '@lib/supabase';

const KEY = 'saved_restaurants';

type SavedStore = {
  savedIds: Set<string>;
  hydrated: boolean;
  toggle: (id: string) => Promise<void>;
  isSaved: (id: string) => boolean;
  hydrate: () => Promise<void>;
  pushAllToSupabase: () => Promise<void>;
  syncFromSupabase: () => Promise<void>;
};

async function getSupabaseUserId(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user.id ?? null;
}

async function syncSavedAction(restaurantId: string, save: boolean, userId: string) {
  if (save) {
    await supabase
      .from('saved_restaurants')
      .upsert({ user_id: userId, restaurant_id: restaurantId });
  } else {
    await supabase
      .from('saved_restaurants')
      .delete()
      .eq('user_id', userId)
      .eq('restaurant_id', restaurantId);
  }
}

export const useSavedStore = create<SavedStore>((set, get) => ({
  savedIds: new Set(),
  hydrated: false,

  toggle: async (id) => {
    const next = new Set(get().savedIds);
    const wasSaved = next.has(id);
    if (wasSaved) next.delete(id);
    else next.add(id);
    set({ savedIds: next });
    await SecureStore.setItemAsync(KEY, JSON.stringify([...next]));
    const userId = await getSupabaseUserId();
    // Bug fix: catch Promise rejection so a Supabase failure is surfaced, not silently swallowed.
    if (userId) syncSavedAction(id, !wasSaved, userId).catch(console.error);
  },

  isSaved: (id) => get().savedIds.has(id),

  hydrate: async () => {
    const raw = await SecureStore.getItemAsync(KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    set({ savedIds: new Set(ids), hydrated: true });
  },

  pushAllToSupabase: async () => {
    const userId = await getSupabaseUserId();
    if (!userId) return;
    const rows = [...get().savedIds].map((restaurant_id) => ({
      user_id: userId,
      restaurant_id,
    }));
    if (rows.length > 0) {
      await supabase.from('saved_restaurants').upsert(rows);
    }
  },

  syncFromSupabase: async () => {
    const userId = await getSupabaseUserId();
    if (!userId) return;
    const { data, error } = await supabase.from('saved_restaurants').select('restaurant_id');
    if (error || !data) return;
    const ids = data.map((r: { restaurant_id: string }) => r.restaurant_id);
    const next = new Set(ids);
    set({ savedIds: next });
    await SecureStore.setItemAsync(KEY, JSON.stringify(ids));
  },
}));
