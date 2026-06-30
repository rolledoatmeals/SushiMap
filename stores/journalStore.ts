import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '@lib/supabase';
import type { JournalEntry, JournalRatings, CreateJournalEntryInput } from '../types';

const KEY = 'journal_entries';

type JournalStore = {
  entries: JournalEntry[];
  hydrated: boolean;
  addEntry: (input: CreateJournalEntryInput) => JournalEntry;
  updateEntry: (id: string, input: Partial<CreateJournalEntryInput>) => void;
  deleteEntry: (id: string) => void;
  getByRestaurant: (restaurantId: string) => JournalEntry[];
  migrateToUser: (userId: string) => void;
  hydrate: () => Promise<void>;
  pushAllToSupabase: () => Promise<void>;
  syncFromSupabase: () => Promise<void>;
};

async function persist(entries: JournalEntry[]) {
  await SecureStore.setItemAsync(KEY, JSON.stringify(entries));
}

async function getSupabaseUserId(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user.id ?? null;
}

function toRow(entry: JournalEntry, userId: string) {
  return {
    id: entry.id,
    user_id: userId,
    restaurant_id: entry.restaurantId,
    date: entry.date,
    photos: entry.photos,
    ratings: entry.ratings,
    notes: entry.notes,
    would_return: entry.wouldReturn,
    created_at: entry.createdAt,
    updated_at: entry.updatedAt,
  };
}

function fromRow(row: Record<string, unknown>): JournalEntry {
  return {
    id: row.id as string,
    restaurantId: row.restaurant_id as string,
    userId: row.user_id as string,
    date: row.date as string,
    photos: (row.photos as string[]) ?? [],
    ratings: row.ratings as JournalRatings,
    notes: (row.notes as string) ?? '',
    wouldReturn: row.would_return as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

async function upsertToSupabase(entry: JournalEntry) {
  const userId = await getSupabaseUserId();
  if (!userId) return;
  await supabase.from('journal_entries').upsert(toRow(entry, userId));
}

async function deleteFromSupabase(id: string) {
  const userId = await getSupabaseUserId();
  if (!userId) return;
  await supabase.from('journal_entries').delete().eq('id', id);
}

export const useJournalStore = create<JournalStore>((set, get) => ({
  entries: [],
  hydrated: false,

  addEntry: (input) => {
    const now = new Date().toISOString();
    const entry: JournalEntry = {
      ...input,
      id: `j_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    const next = [entry, ...get().entries];
    set({ entries: next });
    // Bug fix: add .catch so SecureStore / Supabase failures are surfaced, not silently swallowed.
    persist(next).catch(console.error);
    upsertToSupabase(entry).catch(console.error);
    return entry;
  },

  updateEntry: (id, input) => {
    const next = get().entries.map((e) =>
      e.id === id ? { ...e, ...input, updatedAt: new Date().toISOString() } : e,
    );
    set({ entries: next });
    persist(next).catch(console.error);
    const updated = next.find((e) => e.id === id);
    if (updated) upsertToSupabase(updated).catch(console.error);
  },

  deleteEntry: (id) => {
    const next = get().entries.filter((e) => e.id !== id);
    set({ entries: next });
    persist(next).catch(console.error);
    deleteFromSupabase(id).catch(console.error);
  },

  getByRestaurant: (restaurantId) => get().entries.filter((e) => e.restaurantId === restaurantId),

  migrateToUser: (userId) => {
    const next = get().entries.map((e) => (e.userId === null ? { ...e, userId } : e));
    set({ entries: next });
    persist(next).catch(console.error);
  },

  hydrate: async () => {
    const raw = await SecureStore.getItemAsync(KEY);
    const entries: JournalEntry[] = raw ? (JSON.parse(raw) as JournalEntry[]) : [];
    set({ entries, hydrated: true });
  },

  pushAllToSupabase: async () => {
    const userId = await getSupabaseUserId();
    if (!userId) return;
    const rows = get().entries.map((e) => toRow(e, userId));
    if (rows.length > 0) {
      await supabase.from('journal_entries').upsert(rows);
    }
  },

  syncFromSupabase: async () => {
    const userId = await getSupabaseUserId();
    if (!userId) return;
    // Bug fix: filter to the authenticated user's rows only; without this every
    // row in the table would be fetched if RLS is not yet enforced.
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId);
    if (error || !data || data.length === 0) return;
    const remote = (data as Record<string, unknown>[]).map(fromRow);
    // Merge: remote wins for existing IDs, keep local-only entries
    const localOnly = get().entries.filter((e) => !remote.some((r) => r.id === e.id));
    const merged = [...remote, ...localOnly].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    set({ entries: merged });
    await persist(merged);
  },
}));
