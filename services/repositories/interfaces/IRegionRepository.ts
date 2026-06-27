import type { Region } from '@/types/region';

export interface IRegionRepository {
  getAll(): Promise<Region[]>;
  getById(id: string): Promise<Region | null>;
  getBySlug(slug: string): Promise<Region | null>;
}
