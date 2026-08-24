export function DASHBOARD_CACHE_KEY(userId: string): string {
  return `dashboard:${userId}`;
}

export const DASHBOARD_CACHE_TTL = 5 * 60 * 1000;
