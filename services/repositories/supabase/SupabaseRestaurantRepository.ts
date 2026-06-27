import { supabase } from '@/lib/supabase';
import type { IRestaurantRepository } from '../interfaces/IRestaurantRepository';
import type {
  Restaurant,
  RestaurantFilters,
  RestaurantPricing,
  RestaurantHours,
  RestaurantMedia,
  RestaurantAttribute,
} from '@/types/restaurant';
import { isRestaurantOpenNow } from '@/utils/geo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRestaurant(row: any): Restaurant {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    address: row.address as string,
    city: row.city as string,
    state: row.state as string,
    zip: row.zip as string | null,
    lat: Number(row.lat),
    lng: Number(row.lng),
    phone: row.phone as string | null,
    website: row.website as string | null,
    status: row.status as Restaurant['status'],
    regionId: row.region_id as string | null,
    neighborhood: row.neighborhood as string | null,
    isAyce: Boolean(row.is_ayce),
    pricing: ((row.restaurant_pricing ?? []) as unknown[]).map(toPricing),
    hours: ((row.restaurant_hours ?? []) as unknown[]).map(toHours),
    attributes: ((row.restaurant_attributes ?? []) as Array<{ attribute: string }>).map(
      a => a.attribute as RestaurantAttribute,
    ),
    media: ((row.restaurant_media ?? []) as unknown[])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((m: any) => m.moderation_status === 'approved')
      .map(toMedia),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPricing(row: any): RestaurantPricing {
  return {
    id: row.id as string,
    restaurantId: row.restaurant_id as string,
    mealPeriod: row.meal_period as RestaurantPricing['mealPeriod'],
    pricePerPerson: Number(row.price_per_person),
    currency: row.currency as string,
    notes: row.notes as string | null,
    verificationSource: row.verification_source as RestaurantPricing['verificationSource'],
    verifiedBy: row.verified_by as string | null,
    lastVerifiedAt: row.last_verified_at as string | null,
    confidenceScore: Number(row.confidence_score),
    isCurrent: Boolean(row.is_current),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toHours(row: any): RestaurantHours {
  return {
    restaurantId: row.restaurant_id as string,
    dayOfWeek: Number(row.day_of_week) as RestaurantHours['dayOfWeek'],
    openTime: row.open_time as string | null,
    closeTime: row.close_time as string | null,
    isClosed: Boolean(row.is_closed),
    verificationSource: row.verification_source as RestaurantHours['verificationSource'],
    lastVerifiedAt: row.last_verified_at as string | null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toMedia(row: any): RestaurantMedia {
  return {
    id: row.id as string,
    restaurantId: row.restaurant_id as string,
    url: row.url as string,
    storagePath: row.storage_path as string,
    uploadedBy: row.uploaded_by as string | null,
    isFeatured: Boolean(row.is_featured),
    isOfficial: Boolean(row.is_official),
    sortOrder: Number(row.sort_order),
  };
}

const RESTAURANT_SELECT = `
  *,
  restaurant_pricing(*),
  restaurant_hours(*),
  restaurant_attributes(attribute),
  restaurant_media(*)
` as const;

export class SupabaseRestaurantRepository implements IRestaurantRepository {
  async getAll(filters?: RestaurantFilters): Promise<Restaurant[]> {
    let query = supabase
      .from('restaurants')
      .select(RESTAURANT_SELECT)
      .neq('status', 'pending')
      .is('deleted_at', null);

    if (filters?.regionId) query = query.eq('region_id', filters.regionId);
    if (filters?.neighborhood) query = query.eq('neighborhood', filters.neighborhood);

    if (filters?.bounds) {
      const { northLat, southLat, eastLng, westLng } = filters.bounds;
      query = query
        .lte('lat', northLat)
        .gte('lat', southLat)
        .lte('lng', eastLng)
        .gte('lng', westLng);
    }

    const { data, error } = await query;
    if (error) throw error;

    let results = (data ?? []).map(toRestaurant);

    if (filters?.minPrice !== undefined) {
      results = results.filter(r =>
        r.pricing.some(p => p.isCurrent && p.pricePerPerson >= filters.minPrice!),
      );
    }
    if (filters?.maxPrice !== undefined) {
      results = results.filter(r =>
        r.pricing.some(p => p.isCurrent && p.pricePerPerson <= filters.maxPrice!),
      );
    }
    if (filters?.openNow === true) {
      results = results.filter(r => isRestaurantOpenNow(r.hours));
    }
    if (filters?.attributes?.length) {
      results = results.filter(r =>
        filters.attributes!.every(attr => r.attributes.includes(attr)),
      );
    }

    return results;
  }

  async getById(id: string): Promise<Restaurant | null> {
    const { data, error } = await supabase
      .from('restaurants')
      .select(RESTAURANT_SELECT)
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data ? toRestaurant(data) : null;
  }

  async getBySlug(slug: string): Promise<Restaurant | null> {
    const { data, error } = await supabase
      .from('restaurants')
      .select(RESTAURANT_SELECT)
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data ? toRestaurant(data) : null;
  }

  async search(query: string, filters?: RestaurantFilters): Promise<Restaurant[]> {
    if (query.trim().length === 0) return this.getAll(filters);

    const { data, error } = await supabase
      .from('restaurants')
      .select(RESTAURANT_SELECT)
      .neq('status', 'pending')
      .is('deleted_at', null)
      .textSearch('name', query.trim(), { type: 'websearch' });

    if (error) throw error;

    let results = (data ?? []).map(toRestaurant);

    if (filters?.regionId) results = results.filter(r => r.regionId === filters.regionId);
    if (filters?.bounds) {
      const { northLat, southLat, eastLng, westLng } = filters.bounds;
      results = results.filter(
        r => r.lat <= northLat && r.lat >= southLat && r.lng <= eastLng && r.lng >= westLng,
      );
    }

    return results;
  }
}
