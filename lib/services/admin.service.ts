import { fetchAdminStats } from '@/repositories/stats.repository';
import type { AdminStats } from '@/repositories/stats.repository';

export type { AdminStats };

export async function getAdminStats(): Promise<AdminStats> {
  return fetchAdminStats();
}
