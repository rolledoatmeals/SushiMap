import React, { createContext, useContext, useMemo } from 'react';
import type { IRestaurantRepository } from './interfaces/IRestaurantRepository';
import type { IRegionRepository } from './interfaces/IRegionRepository';
import type { IReviewRepository } from './interfaces/IReviewRepository';
import type { IJournalRepository } from './interfaces/IJournalRepository';
import type { ISavedRepository } from './interfaces/ISavedRepository';
import type { IPassportRepository } from './interfaces/IPassportRepository';
import { LocalRestaurantRepository } from './local/LocalRestaurantRepository';
import { LocalRegionRepository } from './local/LocalRegionRepository';
import { LocalSavedRepository } from '@/services/local/LocalSavedRepository';
import { LocalJournalRepository } from '@/services/local/LocalJournalRepository';
import { SupabaseRestaurantRepository } from './supabase/SupabaseRestaurantRepository';
import { SupabaseRegionRepository } from './supabase/SupabaseRegionRepository';
import { SupabaseReviewRepository } from './supabase/SupabaseReviewRepository';
import { SupabaseJournalRepository } from './supabase/SupabaseJournalRepository';
import { SupabaseSavedRepository } from './supabase/SupabaseSavedRepository';
import { SupabasePassportRepository } from './supabase/SupabasePassportRepository';

export interface Repositories {
  restaurants: IRestaurantRepository;
  regions: IRegionRepository;
  reviews: IReviewRepository;
  journal: IJournalRepository;
  saved: ISavedRepository;
  passport: IPassportRepository;
}

const RepositoryContext = createContext<Repositories | null>(null);

interface Props {
  children: React.ReactNode;
  /**
   * When true, curated restaurant/region data is served from local JSON files.
   * User-specific repositories (journal, saved) use device storage.
   * Defaults to __DEV__ — set explicitly to override during testing.
   */
  useLocalData?: boolean;
  /** When true, user is authenticated — swap guest repositories for Supabase. */
  isAuthenticated?: boolean;
}

export function RepositoryProvider({
  children,
  useLocalData = __DEV__,
  isAuthenticated = false,
}: Props) {
  const repositories = useMemo<Repositories>(
    () => ({
      restaurants: useLocalData
        ? new LocalRestaurantRepository()
        : new SupabaseRestaurantRepository(),
      regions: useLocalData
        ? new LocalRegionRepository()
        : new SupabaseRegionRepository(),
      // Reviews always hit Supabase — they require auth and are community data
      reviews: new SupabaseReviewRepository(),
      // Journal and Saved swap between local and Supabase based on auth state
      journal: isAuthenticated
        ? new SupabaseJournalRepository()
        : new LocalJournalRepository(),
      saved: isAuthenticated
        ? new SupabaseSavedRepository()
        : new LocalSavedRepository(),
      // Passport always requires auth
      passport: new SupabasePassportRepository(),
    }),
    [useLocalData, isAuthenticated],
  );

  return (
    <RepositoryContext.Provider value={repositories}>
      {children}
    </RepositoryContext.Provider>
  );
}

export function useRepositories(): Repositories {
  const ctx = useContext(RepositoryContext);
  if (!ctx) throw new Error('useRepositories must be called within RepositoryProvider');
  return ctx;
}
