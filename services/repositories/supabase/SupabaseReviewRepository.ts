import { supabase } from '@/lib/supabase';
import type { IReviewRepository } from '../interfaces/IReviewRepository';
import type { Review, ReviewSummary, CreateReviewInput, UpdateReviewInput, ReportReason } from '@/types/review';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toReview(row: any): Review {
  return {
    id: row.id as string,
    restaurantId: row.restaurant_id as string,
    userId: row.user_id as string,
    journalEntryId: row.journal_entry_id as string | null,
    fishQuality: Number(row.fish_quality),
    valueRating: row.value_rating != null ? Number(row.value_rating) : null,
    serviceRating: row.service_rating != null ? Number(row.service_rating) : null,
    refillSpeedRating: row.refill_speed_rating != null ? Number(row.refill_speed_rating) : null,
    atmosphereRating: row.atmosphere_rating != null ? Number(row.atmosphere_rating) : null,
    wouldReturn: row.would_return as Review['wouldReturn'],
    body: row.body as string | null,
    visitedMonth: row.visited_month != null ? Number(row.visited_month) : null,
    visitedYear: row.visited_year != null ? Number(row.visited_year) : null,
    pricePaid: row.price_paid != null ? Number(row.price_paid) : null,
    helpfulCount: Number(row.helpful_count ?? 0),
    moderationStatus: row.moderation_status as Review['moderationStatus'],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSummary(row: any): ReviewSummary {
  return {
    restaurantId: row.restaurant_id as string,
    reviewCount: Number(row.review_count),
    avgFishQuality: Number(row.avg_fish_quality),
    avgValue: row.avg_value != null ? Number(row.avg_value) : null,
    avgService: row.avg_service != null ? Number(row.avg_service) : null,
    avgRefillSpeed: row.avg_refill_speed != null ? Number(row.avg_refill_speed) : null,
    avgAtmosphere: row.avg_atmosphere != null ? Number(row.avg_atmosphere) : null,
    wouldReturnPercent: row.would_return_percent != null ? Number(row.would_return_percent) : null,
  };
}

export class SupabaseReviewRepository implements IReviewRepository {
  async getByRestaurant(restaurantId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('moderation_status', 'approved')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(toReview);
  }

  async getSummary(restaurantId: string): Promise<ReviewSummary | null> {
    const { data, error } = await supabase
      .from('restaurant_review_summaries')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data ? toSummary(data) : null;
  }

  async create(input: CreateReviewInput): Promise<Review> {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Authentication required to create a review');

    const now = new Date();
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        restaurant_id: input.restaurantId,
        user_id: user.id,
        journal_entry_id: input.journalEntryId ?? null,
        fish_quality: input.fishQuality,
        value_rating: input.valueRating ?? null,
        service_rating: input.serviceRating ?? null,
        refill_speed_rating: input.refillSpeedRating ?? null,
        atmosphere_rating: input.atmosphereRating ?? null,
        would_return: input.wouldReturn ?? null,
        body: input.body ?? null,
        visited_month: input.visitedMonth ?? now.getMonth() + 1,
        visited_year: input.visitedYear ?? now.getFullYear(),
        price_paid: input.pricePaid ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return toReview(data);
  }

  async update(id: string, input: UpdateReviewInput): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        ...(input.fishQuality !== undefined && { fish_quality: input.fishQuality }),
        ...(input.valueRating !== undefined && { value_rating: input.valueRating }),
        ...(input.serviceRating !== undefined && { service_rating: input.serviceRating }),
        ...(input.refillSpeedRating !== undefined && { refill_speed_rating: input.refillSpeedRating }),
        ...(input.atmosphereRating !== undefined && { atmosphere_rating: input.atmosphereRating }),
        ...(input.wouldReturn !== undefined && { would_return: input.wouldReturn }),
        ...(input.body !== undefined && { body: input.body }),
        ...(input.pricePaid !== undefined && { price_paid: input.pricePaid }),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toReview(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }

  async markHelpful(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_review_helpful', { review_id: id });
    if (error) throw error;
  }

  async report(id: string, reason: ReportReason, details?: string): Promise<void> {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Authentication required to report a review');

    const { error } = await supabase.from('review_reports').insert({
      review_id: id,
      reporter_id: user.id,
      reason,
      details: details ?? null,
    });
    if (error) throw error;
  }
}
