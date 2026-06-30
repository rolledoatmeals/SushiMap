import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const KEYS = {
  isGuest: 'auth_is_guest',
  userId: 'auth_user_id',
  userName: 'auth_user_name',
  userEmail: 'auth_user_email',
  onboardingDone: 'auth_onboarding_done',
  preferences: 'auth_preferences',
};

export type UserPreference = 'best-value' | 'top-rated' | 'open-late' | 'lunch-deals';

type AuthState = {
  isGuest: boolean;
  userId: string | null;
  userName: string;
  userEmail: string;
  onboardingCompleted: boolean;
  preferences: UserPreference[];
  hydrated: boolean;

  setGuest: () => Promise<void>;
  setAppleUser: (userId: string, name: string, email: string) => Promise<void>;
  setName: (name: string, email: string) => void;
  setPreferences: (prefs: UserPreference[]) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  signOut: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  isGuest: true,
  userId: null,
  userName: '',
  userEmail: '',
  onboardingCompleted: false,
  preferences: [],
  hydrated: false,

  setGuest: async () => {
    await SecureStore.setItemAsync(KEYS.isGuest, 'true');
    set({ isGuest: true, userId: null });
  },

  setAppleUser: async (userId, name, email) => {
    await SecureStore.setItemAsync(KEYS.isGuest, 'false');
    await SecureStore.setItemAsync(KEYS.userId, userId);
    await SecureStore.setItemAsync(KEYS.userName, name);
    await SecureStore.setItemAsync(KEYS.userEmail, email);
    set({ isGuest: false, userId, userName: name, userEmail: email });
  },

  setName: (name, email) => {
    set({ userName: name, userEmail: email });
  },

  setPreferences: async (prefs) => {
    await SecureStore.setItemAsync(KEYS.preferences, JSON.stringify(prefs));
    set({ preferences: prefs });
  },

  completeOnboarding: async () => {
    await SecureStore.setItemAsync(KEYS.onboardingDone, 'true');
    set({ onboardingCompleted: true });
  },

  signOut: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.isGuest),
      SecureStore.deleteItemAsync(KEYS.userId),
      SecureStore.deleteItemAsync(KEYS.userName),
      SecureStore.deleteItemAsync(KEYS.userEmail),
      SecureStore.deleteItemAsync(KEYS.onboardingDone),
      SecureStore.deleteItemAsync(KEYS.preferences),
    ]);
    set({
      isGuest: true,
      userId: null,
      userName: '',
      userEmail: '',
      onboardingCompleted: false,
      preferences: [],
    });
  },

  hydrate: async () => {
    const [isGuestRaw, userId, userName, userEmail, onboardingRaw, prefsRaw] = await Promise.all([
      SecureStore.getItemAsync(KEYS.isGuest),
      SecureStore.getItemAsync(KEYS.userId),
      SecureStore.getItemAsync(KEYS.userName),
      SecureStore.getItemAsync(KEYS.userEmail),
      SecureStore.getItemAsync(KEYS.onboardingDone),
      SecureStore.getItemAsync(KEYS.preferences),
    ]);

    set({
      isGuest: isGuestRaw !== 'false',
      userId: userId ?? null,
      userName: userName ?? '',
      userEmail: userEmail ?? '',
      onboardingCompleted: onboardingRaw === 'true',
      preferences: (() => { try { return prefsRaw ? (JSON.parse(prefsRaw) as UserPreference[]) : []; } catch { return []; } })(),
      hydrated: true,
    });
  },
}));
