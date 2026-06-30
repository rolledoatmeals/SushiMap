import type { Restaurant, RestaurantFilters } from '../../types';
import type { RestaurantRepository } from '../RestaurantRepository';
import restaurantsData from '@data/restaurants.json';

const restaurants = restaurantsData as Restaurant[];

export class JsonRestaurantRepository implements RestaurantRepository {
  async getAll(): Promise<Restaurant[]> {
    return restaurants;
  }

  async getById(id: string): Promise<Restaurant | null> {
    return restaurants.find((r) => r.id === id) ?? null;
  }

  async getByNeighborhood(neighborhood: string): Promise<Restaurant[]> {
    return restaurants.filter((r) => r.neighborhood.toLowerCase() === neighborhood.toLowerCase());
  }

  async search(query: string): Promise<Restaurant[]> {
    const q = query.toLowerCase().trim();
    if (!q) return restaurants;
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.neighborhood.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    );
  }

  async filter(filters: RestaurantFilters): Promise<Restaurant[]> {
    return restaurants.filter((r) => {
      if (filters.market && r.market !== filters.market) return false;

      if (filters.neighborhood && r.neighborhood !== filters.neighborhood) return false;

      // Bug fix: use !== undefined instead of bare truthiness so that a value
      // of 0 is never treated as "no filter".
      if (filters.minRating !== undefined && r.rating < filters.minRating) return false;

      if (
        filters.maxLunchPrice !== undefined &&
        r.priceLunch !== null &&
        r.priceLunch !== undefined &&
        r.priceLunch > filters.maxLunchPrice
      ) {
        return false;
      }

      if (filters.maxDinnerPrice !== undefined && r.priceDinner > filters.maxDinnerPrice) {
        return false;
      }

      if (filters.tags && filters.tags.length > 0) {
        const hasAllTags = filters.tags.every((tag) => r.tags.includes(tag));
        if (!hasAllTags) return false;
      }

      return true;
    });
  }

  async getNeighborhoods(): Promise<string[]> {
    const all = restaurants.map((r) => r.neighborhood);
    return [...new Set(all)].sort();
  }
}
