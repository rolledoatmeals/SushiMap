export interface ISavedRepository {
  getSavedIds(): Promise<string[]>;
  save(restaurantId: string): Promise<void>;
  unsave(restaurantId: string): Promise<void>;
  isSaved(restaurantId: string): Promise<boolean>;
  migrate(restaurantIds: string[]): Promise<void>;
  clear(): Promise<void>;
}
