import type { PassportStamp, PassportCollection, CollectionProgress } from '@/types/passport';

export interface IPassportRepository {
  getStamps(): Promise<PassportStamp[]>;
  getStampedRestaurantIds(): Promise<string[]>;
  getCollections(): Promise<PassportCollection[]>;
  getProgress(): Promise<CollectionProgress[]>;
  earnStamp(restaurantId: string, regionId: string, journalEntryId?: string): Promise<PassportStamp>;
}
