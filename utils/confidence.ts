import type { VerificationSource } from '@/types/restaurant';

export type ConfidenceTier = 'owner' | 'admin' | 'community' | 'unverified';

export interface ConfidenceDisplay {
  tier: ConfidenceTier;
  label: string;
  color: string;
}

export function getConfidenceTier(
  source: VerificationSource,
  score: number,
): ConfidenceTier {
  if (source === 'owner' && score >= 90) return 'owner';
  if (source === 'admin' && score >= 80) return 'admin';
  if (score >= 50) return 'community';
  return 'unverified';
}

export function getConfidenceDisplay(
  source: VerificationSource,
  score: number,
  lastVerifiedAt: string | null,
): ConfidenceDisplay {
  const tier = getConfidenceTier(source, score);

  // Degrade tier if data is stale (>6 months)
  const isStale =
    lastVerifiedAt !== null &&
    new Date().getTime() - new Date(lastVerifiedAt).getTime() > 1000 * 60 * 60 * 24 * 180;

  const effectiveTier: ConfidenceTier = isStale && tier !== 'owner' ? 'unverified' : tier;

  switch (effectiveTier) {
    case 'owner':
      return { tier: 'owner', label: 'Owner Verified', color: '#2E7D32' };
    case 'admin':
      return { tier: 'admin', label: 'Verified by Sushi Map', color: '#1565C0' };
    case 'community':
      return { tier: 'community', label: 'Community Verified', color: '#ED8C1E' };
    case 'unverified':
      return { tier: 'unverified', label: 'Unverified — help confirm', color: '#8A7E78' };
  }
}
