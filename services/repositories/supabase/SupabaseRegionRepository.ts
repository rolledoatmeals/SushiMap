import { supabase } from '@/lib/supabase';
import type { IRegionRepository } from '../interfaces/IRegionRepository';
import type { Region } from '@/types/region';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRegion(row: any): Region {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    type: row.type as Region['type'],
    parentId: row.parent_id as string | null,
    bounds: row.bounds ?? null,
    createdAt: row.created_at as string,
  };
}

export class SupabaseRegionRepository implements IRegionRepository {
  async getAll(): Promise<Region[]> {
    const { data, error } = await supabase.from('regions').select('*').order('name');
    if (error) throw error;
    return (data ?? []).map(toRegion);
  }

  async getById(id: string): Promise<Region | null> {
    const { data, error } = await supabase.from('regions').select('*').eq('id', id).single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? toRegion(data) : null;
  }

  async getBySlug(slug: string): Promise<Region | null> {
    const { data, error } = await supabase.from('regions').select('*').eq('slug', slug).single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? toRegion(data) : null;
  }
}
