export interface Profile {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  isVerifiedContributor: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GuestProfile {
  isGuest: true;
}

export type AppUser = Profile | GuestProfile;

export function isGuest(user: AppUser): user is GuestProfile {
  return 'isGuest' in user && user.isGuest === true;
}

export function isProfile(user: AppUser): user is Profile {
  return !('isGuest' in user);
}
