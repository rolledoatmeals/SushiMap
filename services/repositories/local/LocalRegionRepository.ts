import type { IRegionRepository } from '../interfaces/IRegionRepository';
import type { Region } from '@/types/region';

function loadData(): Region[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@/data/regions.json') as Region[];
  } catch {
    return [];
  }
}

export class LocalRegionRepository implements IRegionRepository {
  private readonly data: Region[] = loadData();

  async getAll(): Promise<Region[]> {
    return this.data;
  }

  async getById(id: string): Promise<Region | null> {
    return this.data.find(r => r.id === id) ?? null;
  }

  async getBySlug(slug: string): Promise<Region | null> {
    return this.data.find(r => r.slug === slug) ?? null;
  }
}
