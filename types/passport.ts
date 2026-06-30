// All passport data is DERIVED from JournalEntry records.
// These types describe the computed output, not stored state.

export type PassportStamp = {
  restaurantId: string;
  earnedAt: string; // ISO — date of first journal entry for this restaurant
  visitCount: number;
};

export type Collection = {
  id: string;
  name: string;
  description: string;
  requiredRestaurantIds: string[];
  completedAt: string | null; // ISO — null if not yet complete
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  unlockedAt: string | null; // ISO — null if locked
};

export type CollectionStatus = 'locked' | 'in-progress' | 'unlocked';
