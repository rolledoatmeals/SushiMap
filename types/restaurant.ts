import type { Coordinates, Market, PriceRange, WeeklyHours, DayHours } from './common';

export type RestaurantTag =
  | 'conveyor-belt'
  | 'hot-pot'
  | 'premium-fish'
  | 'sake'
  | 'private-rooms'
  | 'large-groups'
  | 'late-night'
  | 'lunch-special'
  | 'couples'
  | 'family-friendly'
  | 'no-reservations'
  | 'reservations-required'
  | 'byob'
  | 'dinner-only'
  | 'omakase'
  | 'new-spot'
  | 'closed-monday'
  | 'closed-tuesday'
  | 'closed-sunday'
  | 'parking'
  | 'hibachi';

export type Restaurant = {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;

  phone: string;
  website: string | null;
  reservationUrl: string | null;

  priceLunch: number | null; // null = no lunch AYCE service
  priceDinner: number;
  timeLimit: number; // AYCE time limit in minutes

  menuCategories: string[];
  hasSashimi: boolean;
  hasNigiri: boolean;
  hasSpecialtyRolls: boolean;
  drinks: boolean; // non-alcoholic beverages included
  parking: boolean;
  accessibility: boolean; // wheelchair accessible

  hours: WeeklyHours;
  holidayHours: Record<string, DayHours>; // ISO date key e.g. "2024-12-25"

  photos: string[]; // URLs — empty until community uploads

  lastVerifiedDate: string; // ISO date
  verificationSource: string;
  communityConfidenceScore: number; // 0–100

  neighborhood: string;
  city: string;
  state: string;
  market: Market;

  priceRange: PriceRange;
  rating: number; // 1–5, aggregated from JournalEntry ratings
  reviewCount: number;
  tags: RestaurantTag[];
  isVerifiedAYCE: true; // literal true — every record is verified
  description: string;
};

// isOpen() is a runtime computation, not stored in JSON.
// Use isOpenNow(restaurant) from utils/hours.ts.

export type RestaurantFilters = {
  market?: Market;
  neighborhood?: string;
  maxLunchPrice?: number;
  maxDinnerPrice?: number;
  minRating?: number;
  tags?: RestaurantTag[];
  hasSashimi?: boolean;
  hasNigiri?: boolean;
  timeLimitMax?: number;
  parking?: boolean;
  accessibility?: boolean;
  isOpenNow?: boolean;
};

export type RestaurantSortKey = 'rating' | 'distance' | 'price-low' | 'price-high' | 'name';
