import { createMMKV } from 'react-native-mmkv';
import type { IJournalRepository } from '../repositories/interfaces/IJournalRepository';
import type { JournalEntry, CreateJournalEntryInput, UpdateJournalEntryInput } from '@/types/journal';

const storage = createMMKV({ id: 'guest-journal' });
const ENTRIES_KEY = 'journal_entries';

function uuid(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function readEntries(): JournalEntry[] {
  const raw = storage.getString(ENTRIES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as JournalEntry[];
  } catch {
    return [];
  }
}

function writeEntries(entries: JournalEntry[]): void {
  storage.set(ENTRIES_KEY, JSON.stringify(entries));
}

export class LocalJournalRepository implements IJournalRepository {
  async getAll(): Promise<JournalEntry[]> {
    return readEntries().sort(
      (a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime(),
    );
  }

  async getById(id: string): Promise<JournalEntry | null> {
    return readEntries().find(e => e.id === id) ?? null;
  }

  async getByRestaurant(restaurantId: string): Promise<JournalEntry[]> {
    return readEntries().filter(e => e.restaurantId === restaurantId);
  }

  async create(input: CreateJournalEntryInput): Promise<JournalEntry> {
    const now = new Date().toISOString();
    const entry: JournalEntry = {
      id: uuid(),
      userId: 'guest',
      restaurantId: input.restaurantId,
      visitedAt: input.visitedAt,
      pricePaid: input.pricePaid ?? null,
      notes: input.notes ?? null,
      isShared: input.isShared ?? false,
      media: [],
      createdAt: now,
      updatedAt: now,
    };
    writeEntries([...readEntries(), entry]);
    return entry;
  }

  async update(id: string, input: UpdateJournalEntryInput): Promise<JournalEntry> {
    const entries = readEntries();
    const idx = entries.findIndex(e => e.id === id);
    if (idx === -1) throw new Error(`Journal entry ${id} not found`);

    const existing = entries[idx]!;
    const updated: JournalEntry = {
      ...existing,
      ...(input.visitedAt !== undefined && { visitedAt: input.visitedAt }),
      ...(input.pricePaid !== undefined && { pricePaid: input.pricePaid }),
      ...(input.notes !== undefined && { notes: input.notes }),
      ...(input.isShared !== undefined && { isShared: input.isShared }),
      updatedAt: new Date().toISOString(),
    };

    entries[idx] = updated;
    writeEntries(entries);
    return updated;
  }

  async delete(id: string): Promise<void> {
    writeEntries(readEntries().filter(e => e.id !== id));
  }

  async addMedia(_entryId: string, _uri: string): Promise<string> {
    // Local media stays on device — URI is the identifier
    return _uri;
  }

  async removeMedia(_mediaId: string): Promise<void> {
    // No-op for local — media is referenced by URI, not stored separately
  }

  async migrate(entries: JournalEntry[]): Promise<void> {
    // Called after sign-in — caller is responsible for upserting to Supabase
    void entries;
  }
}
