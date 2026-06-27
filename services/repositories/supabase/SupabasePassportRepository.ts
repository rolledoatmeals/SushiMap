import { supabase } from '@/lib/supabase';
import type { IPassportRepository } from '../interfaces/IPassportRepository';
import type { PassportStamp, PassportCollection, CollectionProgress } from '@/types/passport';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toStamp(row: any): PassportStamp {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    restaurantId: row.restaurant_id as string,
    regionId: row.region_id as string,
    journalEntryId: row.journal_entry_id as string | null,
    earnedAt: row.earned_at as string,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCollection(row: any): PassportCollection {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string | null,
    regionId: row.region_id as string | null,
    requiredCount: Number(row.required_count),
    badgeUrl: row.badge_url as string | null,
    rarity: row.rarity as PassportCollection['rarity'],
    type: row.type as PassportCollection['type'],
    sortOrder: Number(row.sort_order ?? 0),
  };
}

export class SupabasePassportRepository implements IPassportRepository {
  private async requireUser(): Promise<string> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Authentication required');
    return user.id;
  }

  async getStamps(): Promise<PassportStamp[]> {
    const userId = await this.requireUser();
    const { data, error } = await supabase
      .from('passport_stamps')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(toStamp);
  }

  async getStampedRestaurantIds(): Promise<string[]> {
    const userId = await this.requireUser();
    const { data, error } = await supabase
      .from('passport_stamps')
      .select('restaurant_id')
      .eq('user_id', userId);

    if (error) throw error;
    return (data ?? []).map(r => r.restaurant_id as string);
  }

  async getCollections(): Promise<PassportCollection[]> {
    const { data, error } = await supabase
      .from('passport_collections')
      .select('*')
      .order('sort_order');
    if (error) throw error;
    return (data ?? []).map(toCollection);
  }

  async getProgress(): Promise<CollectionProgress[]> {
    const [stamps, collections] = await Promise.all([
      this.getStamps(),
      this.getCollections(),
    ]);

    return collections.map(collection => {
      const regionStamps = collection.regionId
        ? stamps.filter(s => s.regionId === collection.regionId)
        : stamps;

      const earnedCount = regionStamps.length;
      const isComplete = earnedCount >= collection.requiredCount;
      const completedAt = isComplete
        ? (regionStamps
            .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
            [collection.requiredCount - 1]?.earnedAt ?? null)
        : null;

      return { collection, earnedCount, isComplete, completedAt };
    });
  }

  async earnStamp(restaurantId: string, regionId: string, journalEntryId?: string): Promise<PassportStamp> {
    const userId = await this.requireUser();
    const { data, error } = await supabase
      .from('passport_stamps')
      .upsert(
        {
          user_id: userId,
          restaurant_id: restaurantId,
          region_id: regionId,
          journal_entry_id: journalEntryId ?? null,
        },
        { onConflict: 'user_id,restaurant_id' },
      )
      .select()
      .single();

    if (error) throw error;
    return toStamp(data);
  }
}
