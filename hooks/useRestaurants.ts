import { useQuery } from '@tanstack/react-query';
import { restaurantService } from '@services/index';
import type { RestaurantFilters, RestaurantSortKey, Coordinates } from '../types';

export function useRestaurants(
  filters?: RestaurantFilters,
  sortBy: RestaurantSortKey = 'rating',
  userLocation?: Coordinates,
) {
  return useQuery({
    queryKey: ['restaurants', filters, sortBy, userLocation],
    queryFn: () => restaurantService.getAll(filters, sortBy, userLocation),
  });
}

export function useRestaurant(id: string) {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => restaurantService.getById(id),
    enabled: !!id,
  });
}

export function useOpenNowRestaurants() {
  return useQuery({
    queryKey: ['restaurants', 'open-now'],
    queryFn: () => restaurantService.getOpenNow(),
    refetchInterval: 1000 * 60, // refresh every minute
  });
}

export function useRestaurantSearch(query: string) {
  return useQuery({
    queryKey: ['restaurants', 'search', query],
    queryFn: () => restaurantService.search(query),
    enabled: query.trim().length > 0,
  });
}
