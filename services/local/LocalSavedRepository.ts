import { MMKV, createMMKV } from 'react-native-mmkv';
import type { ISavedRepository } from '../repositories/interfaces/ISavedRepository';

const SAVED_KEY = 'saved_restaurant_ids';

let _storage: MMKV | null = null;
function getStorage(): MMKV {
  if (!_storage) _storage = createMMKV({ id: 'guest-saved' });
  return _storage;
}

function readIds(): string[] {
  const raw = getStorage().getString(SAVED_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]): void {
  getStorage().set(SAVED_KEY, JSON.stringify(ids));
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
    getStorage().remove(SAVED_KEY);
  }
}
