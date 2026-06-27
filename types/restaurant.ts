export type RestaurantStatus =
  | 'active'
  | 'closed_temporarily'
  | 'closed_permanently'
  | 'pending'
  | 'unverified';

export type VerificationSource = 'owner' | 'admin' | 'community' | 'pending';

export type MealPeriod =
  | 'lunch'
  | 'dinner'
  | 'weekend_lunch'
  | 'weekend_dinner'
  | 'all_day'
  | 'kids'
  | 'special';

export type RestaurantAttribute =
  | 'byo_wine'
  | 'byo_beer'
  | 'byo_sake'
  | 'parking_free'
  | 'parking_paid'
  | 'reservations'
  | 'walk_in_only'
  | 'delivery'
  | 'takeout'
  | 'private_dining'
  | 'halal'
  | 'wheelchair_accessible'
  | 'outdoor_seating';

export interface RestaurantMedia {
  id: string;
  restaurantId: string;
  url: string;
  storagePath: string;
  uploadedBy: string | null;
  isFeatured: boolean;
  isOfficial: boolean;
  sortOrder: number;
}

export interface RestaurantPricing {
  id: string;
  restaurantId: string;
  mealPeriod: MealPeriod;
  pricePerPerson: number;
  currency: string;
  notes: string | null;
  verificationSource: VerificationSource;
  verifiedBy: string | null;
  lastVerifiedAt: string | null;
  confidenceScore: number;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantHours {
  restaurantId: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
  verificationSource: VerificationSource;
  lastVerifiedAt: string | null;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  zip: string | null;
  lat: number;
  lng: number;
  phone: string | null;
  website: string | null;
  status: RestaurantStatus;
  regionId: string | null;
  neighborhood: string | null;
  isAyce: boolean;
  pricing: RestaurantPricing[];
  hours: RestaurantHours[];
  attributes: RestaurantAttribute[];
  media: RestaurantMedia[];
  createdAt: string;
  updatedAt: string;
}

export interface MapBounds {
  northLat: number;
  southLat: number;
  eastLng: number;
  westLng: number;
}

export interface RestaurantFilters {
  regionId?: string;
  neighborhood?: string;
  maxPrice?: number;
  minPrice?: number;
  openNow?: boolean;
  attributes?: RestaurantAttribute[];
  bounds?: MapBounds;
}
