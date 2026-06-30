import type { Restaurant, RestaurantFilters } from '../types';
import type { IRestaurantRepository } from './IRestaurantRepository';
import rawData from '@data/restaurants.json';

// Cast once at the boundary — all JSON fields match Restaurant exactly.
const RESTAURANTS = rawData as Restaurant[];

export class LocalRestaurantRepository implements IRestaurantRepository {
  async getAll(): Promise<Restaurant[]> {
    return RESTAURANTS;
  }

  async getById(id: string): Promise<Restaurant | null> {
    return RESTAURANTS.find((r) => r.id === id) ?? null;
  }

  async getByNeighborhood(neighborhood: string): Promise<Restaurant[]> {
    const q = neighborhood.toLowerCase();
    return RESTAURANTS.filter((r) => r.neighborhood.toLowerCase() === q);
  }

  async search(query: string): Promise<Restaurant[]> {
    const q = query.toLowerCase().trim();
    if (!q) return RESTAURANTS;
    return RESTAURANTS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.neighborhood.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.menuCategories.some((c) => c.toLowerCase().includes(q)),
    );
  }

  async filter(filters: RestaurantFilters): Promise<Restaurant[]> {
    return RESTAURANTS.filter((r) => {
      if (filters.market && r.market !== filters.market) return false;
      if (filters.neighborhood && r.neighborhood !== filters.neighborhood) return false;
      if (filters.minRating !== undefined && r.rating < filters.minRating) return false;
      if (
        filters.maxLunchPrice !== undefined &&
        r.priceLunch !== null &&
        r.priceLunch > filters.maxLunchPrice
      )
        return false;
      if (filters.maxDinnerPrice !== undefined && r.priceDinner > filters.maxDinnerPrice)
        return false;
      if (filters.hasSashimi === true && !r.hasSashimi) return false;
      if (filters.hasNigiri === true && !r.hasNigiri) return false;
      if (filters.timeLimitMax !== undefined && r.timeLimit > filters.timeLimitMax) return false;
      if (filters.parking === true && !r.parking) return false;
      if (filters.accessibility === true && !r.accessibility) return false;
      if (filters.tags && filters.tags.length > 0) {
        if (!filters.tags.every((tag) => r.tags.includes(tag))) return false;
      }
      return true;
    });
  }

  async getNeighborhoods(): Promise<string[]> {
    const set = new Set(RESTAURANTS.map((r) => r.neighborhood));
    return [...set].sort();
  }
}
