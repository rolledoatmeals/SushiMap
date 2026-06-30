import type { Restaurant, RestaurantFilters } from '../types';

export interface RestaurantRepository {
  getAll(): Promise<Restaurant[]>;
  getById(id: string): Promise<Restaurant | null>;
  getByNeighborhood(neighborhood: string): Promise<Restaurant[]>;
  search(query: string): Promise<Restaurant[]>;
  filter(filters: RestaurantFilters): Promise<Restaurant[]>;
  getNeighborhoods(): Promise<string[]>;
}
