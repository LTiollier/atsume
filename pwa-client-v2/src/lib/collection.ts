import { isFutureDate } from './utils';
import type { Edition, Volume } from '@/types/volume';

/**
 * Count owned volumes that are already released.
 * Excludes pre-orders with a future published_date. (js-early-exit, js-combine-iterations)
 */
export function countReleasedOwned(volumes: Volume[]): number {
  let count = 0;
  for (const v of volumes) {
    if (v.is_owned && !isFutureDate(v.published_date)) count++;
  }
  return count;
}

/**
 * Sum released_volumes (or total_volumes as fallback) across all unique editions
 * linked to the given volumes. Returns null when no edition has data.
 * (js-set-map-lookups, js-combine-iterations)
 */
export function sumReleasedTotal(volumes: Volume[]): number | null {
  const seen = new Set<number>();
  let sum = 0;
  let hasAny = false;
  for (const v of volumes) {
    if (!v.edition?.id || seen.has(v.edition.id)) continue;
    const t = v.edition.released_volumes ?? v.edition.total_volumes;
    if (t != null) { seen.add(v.edition.id); sum += t; hasAny = true; }
  }
  return hasAny ? sum : null;
}

/**
 * Released total for a single Edition.
 * Prefers released_volumes (server-computed, already excludes future volumes).
 */
export function editionReleasedTotal(edition: Edition): number | null {
  return edition.released_volumes ?? edition.total_volumes;
}
