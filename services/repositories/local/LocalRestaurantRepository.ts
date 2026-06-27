import type { IRestaurantRepository } from '../interfaces/IRestaurantRepository';
import type { Restaurant, RestaurantFilters } from '@/types/restaurant';
import { isRestaurantOpenNow } from '@/utils/geo';

// JSON files are loaded lazily so the module doesn't throw at import time
// if the data files haven't been created yet during development.
function loadData(): Restaurant[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nyc = require('@/data/restaurants.nyc.json') as Restaurant[];
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nj = require('@/data/restaurants.nj.json') as Restaurant[];
    return [...nyc, ...nj];
  } catch {
    return [];
  }
}

function applyFilters(list: Restaurant[], filters: RestaurantFilters): Restaurant[] {
  let result = list.filter(r => r.status === 'active');

  if (filters.regionId !== undefined) {
    result = result.filter(r => r.regionId === filters.regionId);
  }

  if (filters.neighborhood !== undefined) {
    const n = filters.neighborhood.toLowerCase();
    result = result.filter(r => r.neighborhood?.toLowerCase() === n);
  }

  if (filters.minPrice !== undefined) {
    result = result.filter(r =>
      r.pricing.some(p => p.isCurrent && p.pricePerPerson >= filters.minPrice!),
    );
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter(r =>
      r.pricing.some(p => p.isCurrent && p.pricePerPerson <= filters.maxPrice!),
    );
  }

  if (filters.openNow === true) {
    result = result.filter(r => isRestaurantOpenNow(r.hours));
  }

  if (filters.attributes !== undefined && filters.attributes.length > 0) {
    result = result.filter(r =>
      filters.attributes!.every(attr => r.attributes.includes(attr)),
    );
  }

  if (filters.bounds !== undefined) {
    const { northLat, southLat, eastLng, westLng } = filters.bounds;
    result = result.filter(
      r => r.lat <= northLat && r.lat >= southLat && r.lng <= eastLng && r.lng >= westLng,
    );
  }

  return result;
}

export class LocalRestaurantRepository implements IRestaurantRepository {
  private readonly data: Restaurant[] = loadData();

  async getAll(filters?: RestaurantFilters): Promise<Restaurant[]> {
    if (!filters) return this.data.filter(r => r.status === 'active');
    return applyFilters(this.data, filters);
  }

  async getById(id: string): Promise<Restaurant | null> {
    return this.data.find(r => r.id === id) ?? null;
  }

  async getBySlug(slug: string): Promise<Restaurant | null> {
    return this.data.find(r => r.slug === slug) ?? null;
  }

  async search(query: string, filters?: RestaurantFilters): Promise<Restaurant[]> {
    const q = query.toLowerCase().trim();
    const base = filters ? applyFilters(this.data, filters) : this.data.filter(r => r.status === 'active');

    if (q.length === 0) return base;

    return base.filter(
      r =>
        r.name.toLowerCase().includes(q) ||
        r.neighborhood?.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q),
    );
  }
}
