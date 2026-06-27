import type { JournalEntry, CreateJournalEntryInput, UpdateJournalEntryInput } from '@/types/journal';

export interface IJournalRepository {
  getAll(): Promise<JournalEntry[]>;
  getById(id: string): Promise<JournalEntry | null>;
  getByRestaurant(restaurantId: string): Promise<JournalEntry[]>;
  create(input: CreateJournalEntryInput): Promise<JournalEntry>;
  update(id: string, input: UpdateJournalEntryInput): Promise<JournalEntry>;
  delete(id: string): Promise<void>;
  addMedia(entryId: string, uri: string): Promise<string>;
  removeMedia(mediaId: string): Promise<void>;
  migrate(entries: JournalEntry[]): Promise<void>;
}
