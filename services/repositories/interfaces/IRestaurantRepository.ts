import type { Restaurant, RestaurantFilters } from '@/types/restaurant';

export interface IRestaurantRepository {
  getAll(filters?: RestaurantFilters): Promise<Restaurant[]>;
  getById(id: string): Promise<Restaurant | null>;
  getBySlug(slug: string): Promise<Restaurant | null>;
  search(query: string, filters?: RestaurantFilters): Promise<Restaurant[]>;
}
