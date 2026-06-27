export interface JournalMedia {
  id: string;
  journalEntryId: string;
  url: string;
  storagePath: string;
  sortOrder: number;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  restaurantId: string;
  visitedAt: string;
  pricePaid: number | null;
  notes: string | null;
  isShared: boolean;
  media: JournalMedia[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateJournalEntryInput {
  restaurantId: string;
  visitedAt: string;
  pricePaid?: number;
  notes?: string;
  isShared?: boolean;
}

export interface UpdateJournalEntryInput {
  visitedAt?: string;
  pricePaid?: number | null;
  notes?: string | null;
  isShared?: boolean;
}
