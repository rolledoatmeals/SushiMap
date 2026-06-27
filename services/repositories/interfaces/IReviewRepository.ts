import type { Review, ReviewSummary, CreateReviewInput, UpdateReviewInput, ReportReason } from '@/types/review';

export interface IReviewRepository {
  getByRestaurant(restaurantId: string): Promise<Review[]>;
  getSummary(restaurantId: string): Promise<ReviewSummary | null>;
  create(input: CreateReviewInput): Promise<Review>;
  update(id: string, input: UpdateReviewInput): Promise<Review>;
  delete(id: string): Promise<void>;
  markHelpful(id: string): Promise<void>;
  report(id: string, reason: ReportReason, details?: string): Promise<void>;
}
