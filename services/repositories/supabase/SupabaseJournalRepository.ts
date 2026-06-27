import { supabase } from '@/lib/supabase';
import type { IJournalRepository } from '../interfaces/IJournalRepository';
import type { JournalEntry, JournalMedia, CreateJournalEntryInput, UpdateJournalEntryInput } from '@/types/journal';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toEntry(row: any): JournalEntry {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    restaurantId: row.restaurant_id as string,
    visitedAt: row.visited_at as string,
    pricePaid: row.price_paid != null ? Number(row.price_paid) : null,
    notes: row.notes as string | null,
    isShared: Boolean(row.is_shared),
    media: ((row.journal_media ?? []) as unknown[]).map(toMedia),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toMedia(row: any): JournalMedia {
  return {
    id: row.id as string,
    journalEntryId: row.journal_entry_id as string,
    url: row.url as string,
    storagePath: row.storage_path as string,
    sortOrder: Number(row.sort_order ?? 0),
    createdAt: row.created_at as string,
  };
}

const ENTRY_SELECT = '*, journal_media(*)' as const;

export class SupabaseJournalRepository implements IJournalRepository {
  private async requireUser(): Promise<string> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Authentication required');
    return user.id;
  }

  async getAll(): Promise<JournalEntry[]> {
    const userId = await this.requireUser();
    const { data, error } = await supabase
      .from('journal_entries')
      .select(ENTRY_SELECT)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('visited_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(toEntry);
  }

  async getById(id: string): Promise<JournalEntry | null> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select(ENTRY_SELECT)
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? toEntry(data) : null;
  }

  async getByRestaurant(restaurantId: string): Promise<JournalEntry[]> {
    const userId = await this.requireUser();
    const { data, error } = await supabase
      .from('journal_entries')
      .select(ENTRY_SELECT)
      .eq('user_id', userId)
      .eq('restaurant_id', restaurantId)
      .is('deleted_at', null)
      .order('visited_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(toEntry);
  }

  async create(input: CreateJournalEntryInput): Promise<JournalEntry> {
    const userId = await this.requireUser();
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        restaurant_id: input.restaurantId,
        visited_at: input.visitedAt,
        price_paid: input.pricePaid ?? null,
        notes: input.notes ?? null,
        is_shared: input.isShared ?? false,
      })
      .select(ENTRY_SELECT)
      .single();

    if (error) throw error;
    return toEntry(data);
  }

  async update(id: string, input: UpdateJournalEntryInput): Promise<JournalEntry> {
    const { data, error } = await supabase
      .from('journal_entries')
      .update({
        ...(input.visitedAt !== undefined && { visited_at: input.visitedAt }),
        ...(input.pricePaid !== undefined && { price_paid: input.pricePaid }),
        ...(input.notes !== undefined && { notes: input.notes }),
        ...(input.isShared !== undefined && { is_shared: input.isShared }),
      })
      .eq('id', id)
      .select(ENTRY_SELECT)
      .single();

    if (error) throw error;
    return toEntry(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('journal_entries')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }

  async addMedia(entryId: string, uri: string): Promise<string> {
    const fileName = `journal/${entryId}/${Date.now()}.jpg`;
    const response = await fetch(uri);
    const blob = await response.blob();

    const { error: uploadError } = await supabase.storage
      .from('journal-media')
      .upload(fileName, blob, { contentType: 'image/jpeg' });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('journal-media')
      .getPublicUrl(fileName);

    const { error: insertError } = await supabase.from('journal_media').insert({
      journal_entry_id: entryId,
      storage_path: fileName,
      url: publicUrl,
      sort_order: 0,
    });

    if (insertError) throw insertError;
    return publicUrl;
  }

  async removeMedia(mediaId: string): Promise<void> {
    const { data, error: fetchError } = await supabase
      .from('journal_media')
      .select('storage_path')
      .eq('id', mediaId)
      .single();

    if (fetchError) throw fetchError;

    await supabase.storage.from('journal-media').remove([data.storage_path]);

    const { error } = await supabase.from('journal_media').delete().eq('id', mediaId);
    if (error) throw error;
  }

  async migrate(entries: JournalEntry[]): Promise<void> {
    const userId = await this.requireUser();
    if (entries.length === 0) return;

    const rows = entries.map(e => ({
      user_id: userId,
      restaurant_id: e.restaurantId,
      visited_at: e.visitedAt,
      price_paid: e.pricePaid,
      notes: e.notes,
      is_shared: e.isShared,
    }));

    const { error } = await supabase.from('journal_entries').upsert(rows, {
      onConflict: 'user_id,restaurant_id,visited_at',
      ignoreDuplicates: true,
    });
    if (error) throw error;
  }
}
