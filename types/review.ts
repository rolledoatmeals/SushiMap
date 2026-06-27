export type ModerationStatus = 'approved' | 'pending' | 'flagged' | 'rejected';
export type WouldReturn = 'yes' | 'no' | 'maybe';
export type ReportReason =
  | 'spam'
  | 'inaccurate'
  | 'inappropriate'
  | 'conflict_of_interest'
  | 'other';

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  journalEntryId: string | null;
  fishQuality: number;
  valueRating: number | null;
  serviceRating: number | null;
  refillSpeedRating: number | null;
  atmosphereRating: number | null;
  wouldReturn: WouldReturn | null;
  body: string | null;
  visitedMonth: number | null;
  visitedYear: number | null;
  pricePaid: number | null;
  helpfulCount: number;
  moderationStatus: ModerationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSummary {
  restaurantId: string;
  reviewCount: number;
  avgFishQuality: number;
  avgValue: number | null;
  avgService: number | null;
  avgRefillSpeed: number | null;
  avgAtmosphere: number | null;
  wouldReturnPercent: number | null;
}

export interface CreateReviewInput {
  restaurantId: string;
  journalEntryId?: string;
  fishQuality: number;
  valueRating?: number;
  serviceRating?: number;
  refillSpeedRating?: number;
  atmosphereRating?: number;
  wouldReturn?: WouldReturn;
  body?: string;
  visitedMonth?: number;
  visitedYear?: number;
  pricePaid?: number;
}

export type UpdateReviewInput = Partial<Omit<CreateReviewInput, 'restaurantId' | 'journalEntryId'>>;
