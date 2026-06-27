import type { MMKV } from 'react-native-mmkv';
import { createMMKV } from 'react-native-mmkv';

export type FavoriteAyce = 'sashimi' | 'rolls' | 'nigiri' | 'value' | 'open';
export type Budget = 'under_30' | '30_40' | '40_50' | '50_plus';
export type DiningWith = 'solo' | 'partner' | 'friends' | 'family' | 'anyone';

export interface UserPreferences {
  favoriteAyce?: FavoriteAyce;
  budget?: Budget;
  diningWith?: DiningWith;
}

let _storage: MMKV | null = null;
function getStorage(): MMKV {
  if (!_storage) _storage = createMMKV({ id: 'user-preferences' });
  return _storage;
}

export function isOnboardingComplete(): boolean {
  try {
    return getStorage().getBoolean('onboarding_complete') ?? false;
  } catch {
    return false;
  }
}

export function savePreferences(prefs: Partial<UserPreferences>): void {
  const s = getStorage();
  if (prefs.favoriteAyce) s.set('pref_ayce', prefs.favoriteAyce);
  if (prefs.budget) s.set('pref_budget', prefs.budget);
  if (prefs.diningWith) s.set('pref_dining_with', prefs.diningWith);
}

export function markOnboardingComplete(): void {
  getStorage().set('onboarding_complete', true);
}

export function getPreferences(): UserPreferences {
  try {
    const s = getStorage();
    return {
      favoriteAyce: (s.getString('pref_ayce') as FavoriteAyce) || undefined,
      budget: (s.getString('pref_budget') as Budget) || undefined,
      diningWith: (s.getString('pref_dining_with') as DiningWith) || undefined,
    };
  } catch {
    return {};
  }
}
