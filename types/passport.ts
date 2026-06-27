export type StampRarity = 'common' | 'uncommon' | 'rare' | 'legendary';
export type CollectionType = 'regional' | 'neighborhood' | 'hidden_gem' | 'special';

export interface PassportStamp {
  id: string;
  userId: string;
  restaurantId: string;
  regionId: string;
  journalEntryId: string | null;
  earnedAt: string;
}

export interface PassportCollection {
  id: string;
  name: string;
  description: string | null;
  regionId: string | null;
  requiredCount: number;
  badgeUrl: string | null;
  rarity: StampRarity;
  type: CollectionType;
  sortOrder: number;
}

export interface CollectionProgress {
  collection: PassportCollection;
  earnedCount: number;
  isComplete: boolean;
  completedAt: string | null;
}
