import { useQuery } from '@tanstack/react-query';
import { useRepositories } from '@/services/repositories/RepositoryContext';
import type { RestaurantFilters } from '@/types/restaurant';

export function useRestaurants(filters?: RestaurantFilters) {
  const { restaurants } = useRepositories();
  return useQuery({
    queryKey: ['restaurants', filters],
    queryFn: () => restaurants.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRestaurant(id: string | null) {
  const { restaurants } = useRepositories();
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => restaurants.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRestaurantSearch(query: string, filters?: RestaurantFilters) {
  const { restaurants } = useRepositories();
  return useQuery({
    queryKey: ['restaurants', 'search', query, filters],
    queryFn: () => restaurants.search(query, filters),
    staleTime: 60 * 1000,
  });
}
