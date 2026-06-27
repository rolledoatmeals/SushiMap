export function formatVisitDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function formatMonthYear(month: number, year: number): string {
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function formatLastVerified(dateString: string | null): string {
  if (!dateString) return 'Never verified';
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Verified today';
  if (diffDays === 1) return 'Verified yesterday';
  if (diffDays < 30) return `Verified ${diffDays} days ago`;
  if (diffDays < 365) return `Verified ${Math.floor(diffDays / 30)} months ago`;
  return `Verified ${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
}

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0] ?? '';
}

export function todayISODate(): string {
  return toISODate(new Date());
}
