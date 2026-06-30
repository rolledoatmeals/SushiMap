// Public service API — the only import UI screens should use.
// Swap LocalRestaurantRepository → SupabaseRestaurantRepository here
// when the backend is ready. Zero UI changes required.

import { LocalRestaurantRepository } from '@repositories/LocalRestaurantRepository';
import { RestaurantService } from './RestaurantService';

export const restaurantService = new RestaurantService(new LocalRestaurantRepository());

export { RestaurantService } from './RestaurantService';
