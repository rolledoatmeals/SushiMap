import { LocalSavedRepository } from './LocalSavedRepository';
import { LocalJournalRepository } from './LocalJournalRepository';
import { SupabaseSavedRepository } from '../repositories/supabase/SupabaseSavedRepository';
import { SupabaseJournalRepository } from '../repositories/supabase/SupabaseJournalRepository';

/**
 * Called once after a guest user signs in with Apple.
 * Reads all local data and upserts it to Supabase, then clears local storage.
 */
export async function migrateGuestDataToCloud(): Promise<void> {
  const localSaved = new LocalSavedRepository();
  const localJournal = new LocalJournalRepository();
  const supabaseSaved = new SupabaseSavedRepository();
  const supabaseJournal = new SupabaseJournalRepository();

  const [savedIds, journalEntries] = await Promise.all([
    localSaved.getSavedIds(),
    localJournal.getAll(),
  ]);

  await Promise.all([
    savedIds.length > 0 ? supabaseSaved.migrate(savedIds) : Promise.resolve(),
    journalEntries.length > 0 ? supabaseJournal.migrate(journalEntries) : Promise.resolve(),
  ]);

  await Promise.all([localSaved.clear(), localJournal.migrate([])]);
}
