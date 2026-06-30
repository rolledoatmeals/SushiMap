import type {
  Restaurant,
  RestaurantFilters,
  RestaurantSortKey,
  Coordinates,
  JournalEntry,
} from '../types';
import type { IRestaurantRepository } from '@repositories/IRestaurantRepository';
import { isOpenNow } from '@utils/hours';

function haversineKm(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function sortRestaurants(
  list: Restaurant[],
  sortBy: RestaurantSortKey,
  userLocation?: Coordinates,
): Restaurant[] {
  return [...list].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-low': {
        const ap = a.priceDinner;
        const bp = b.priceDinner;
        return ap - bp;
      }
      case 'price-high': {
        return b.priceDinner - a.priceDinner;
      }
      case 'distance': {
        if (!userLocation) return 0;
        return haversineKm(userLocation, a.coordinates) - haversineKm(userLocation, b.coordinates);
      }
    }
  });
}

export class RestaurantService {
  constructor(private readonly repo: IRestaurantRepository) {}

  async getAll(
    filters?: RestaurantFilters,
    sortBy: RestaurantSortKey = 'rating',
    userLocation?: Coordinates,
  ): Promise<Restaurant[]> {
    const list = filters ? await this.repo.filter(filters) : await this.repo.getAll();
    return sortRestaurants(list, sortBy, userLocation);
  }

  async getById(id: string): Promise<Restaurant | null> {
    return this.repo.getById(id);
  }

  async getByNeighborhood(
    neighborhood: string,
    sortBy: RestaurantSortKey = 'rating',
  ): Promise<Restaurant[]> {
    const list = await this.repo.getByNeighborhood(neighborhood);
    return sortRestaurants(list, sortBy);
  }

  async search(
    query: string,
    sortBy: RestaurantSortKey = 'rating',
    userLocation?: Coordinates,
  ): Promise<Restaurant[]> {
    const list = await this.repo.search(query);
    return sortRestaurants(list, sortBy, userLocation);
  }

  async getNearby(
    lat: number,
    lng: number,
    radiusKm: number,
    sortBy: RestaurantSortKey = 'distance',
  ): Promise<Restaurant[]> {
    const origin: Coordinates = { latitude: lat, longitude: lng };
    const all = await this.repo.getAll();
    const nearby = all.filter((r) => haversineKm(origin, r.coordinates) <= radiusKm);
    return sortRestaurants(nearby, sortBy, origin);
  }

  async getOpenNow(
    sortBy: RestaurantSortKey = 'rating',
    userLocation?: Coordinates,
  ): Promise<Restaurant[]> {
    const all = await this.repo.getAll();
    const open = all.filter((r) => isOpenNow(r));
    return sortRestaurants(open, sortBy, userLocation);
  }

  async getNeighborhoods(): Promise<string[]> {
    return this.repo.getNeighborhoods();
  }

  // Aggregate ratings from local journal entries onto a restaurant.
  // Called by screens — no Supabase needed until backend exists.
  applyJournalRatings(restaurant: Restaurant, entries: JournalEntry[]): Restaurant {
    const relevant = entries.filter((e) => e.restaurantId === restaurant.id);
    if (relevant.length === 0) return restaurant;

    const avg = (vals: number[]) =>
      vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;

    // Bug fix: average all available rating dimensions, not just fishQuality.
    const perEntry = relevant.map((e) => {
      const r = e.ratings;
      const vals = [r.fishQuality, r.value, r.service, r.refillSpeed, r.atmosphere].filter(
        (v): v is NonNullable<typeof v> => v !== undefined,
      );
      return avg(vals);
    });
    const aggregated = avg(perEntry);

    return {
      ...restaurant,
      rating: parseFloat(aggregated.toFixed(1)),
      reviewCount: relevant.length,
    };
  }
}
