import type { RatingValue } from './common';

export type JournalRatings = {
  fishQuality: RatingValue; // required
  value?: RatingValue;
  service?: RatingValue;
  refillSpeed?: RatingValue;
  atmosphere?: RatingValue;
};

export type JournalEntry = {
  id: string;
  restaurantId: string;
  userId: string | null; // null for guest
  date: string; // ISO date of the visit
  photos: string[]; // local URIs or remote URLs
  notes: string;
  ratings: JournalRatings;
  wouldReturn: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type CreateJournalEntryInput = Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateJournalEntryInput = Partial<CreateJournalEntryInput>;
