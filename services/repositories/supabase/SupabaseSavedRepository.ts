import { supabase } from '@/lib/supabase';
import type { ISavedRepository } from '../interfaces/ISavedRepository';

export class SupabaseSavedRepository implements ISavedRepository {
  private async requireUser(): Promise<string> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Authentication required');
    return user.id;
  }

  async getSavedIds(): Promise<string[]> {
    const userId = await this.requireUser();
    const { data, error } = await supabase
      .from('saved_restaurants')
      .select('restaurant_id')
      .eq('user_id', userId);

    if (error) throw error;
    return (data ?? []).map(r => r.restaurant_id as string);
  }

  async save(restaurantId: string): Promise<void> {
    const userId = await this.requireUser();
    const { error } = await supabase
      .from('saved_restaurants')
      .upsert({ user_id: userId, restaurant_id: restaurantId });
    if (error) throw error;
  }

  async unsave(restaurantId: string): Promise<void> {
    const userId = await this.requireUser();
    const { error } = await supabase
      .from('saved_restaurants')
      .delete()
      .eq('user_id', userId)
      .eq('restaurant_id', restaurantId);
    if (error) throw error;
  }

  async isSaved(restaurantId: string): Promise<boolean> {
    const userId = await this.requireUser();
    const { data, error } = await supabase
      .from('saved_restaurants')
      .select('restaurant_id')
      .eq('user_id', userId)
      .eq('restaurant_id', restaurantId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return false;
      throw error;
    }
    return data !== null;
  }

  async migrate(restaurantIds: string[]): Promise<void> {
    if (restaurantIds.length === 0) return;
    const userId = await this.requireUser();

    const rows = restaurantIds.map(id => ({ user_id: userId, restaurant_id: id }));
    const { error } = await supabase
      .from('saved_restaurants')
      .upsert(rows, { ignoreDuplicates: true });
    if (error) throw error;
  }

  async clear(): Promise<void> {
    // No-op for Supabase — records are authoritative; clearing happens via unsave()
  }
}
