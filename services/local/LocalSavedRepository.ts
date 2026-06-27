import { createMMKV } from 'react-native-mmkv';
import type { ISavedRepository } from '../repositories/interfaces/ISavedRepository';

const storage = createMMKV({ id: 'guest-saved' });
const SAVED_KEY = 'saved_restaurant_ids';

function readIds(): string[] {
  const raw = storage.getString(SAVED_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]): void {
  storage.set(SAVED_KEY, JSON.stringify(ids));
}

export class LocalSavedRepository implements ISavedRepository {
  async getSavedIds(): Promise<string[]> {
    return readIds();
  }

  async save(restaurantId: string): Promise<void> {
    const ids = readIds();
    if (!ids.includes(restaurantId)) {
      writeIds([...ids, restaurantId]);
    }
  }

  async unsave(restaurantId: string): Promise<void> {
    writeIds(readIds().filter(id => id !== restaurantId));
  }

  async isSaved(restaurantId: string): Promise<boolean> {
    return readIds().includes(restaurantId);
  }

  async migrate(restaurantIds: string[]): Promise<void> {
    // Called after sign-in — caller is responsible for upserting to Supabase
    // This method just surfaces the local data for the migration service
    void restaurantIds;
  }

  async clear(): Promise<void> {
    storage.remove(SAVED_KEY);
  }
}
