import Image from 'next/image';
import Link from 'next/link';
import { Package } from 'lucide-react';

import type { Series } from '@/types/manga';

// Hoisted fallback — identique sur chaque render (rendering-hoist-jsx)
const coverFallback = (
  <div className="absolute inset-0 flex items-center justify-center">
    <Package size={32} aria-hidden style={{ color: 'var(--muted-foreground)' }} />
  </div>
);

interface SeriesCardProps {
  series: Series;
  possessedCount: number;
  /** null = total inconnu → on affiche seulement possessedCount */
  totalVolumes: number | null;
  href: string;
  /**
   * Override de cover — utile quand on veut afficher la cover d'une édition
   * plutôt que celle de la série.
   */
  coverUrl?: string | null;
}

export function SeriesCard({
  series,
  possessedCount,
  totalVolumes,
  href,
  coverUrl,
}: SeriesCardProps) {
  const cover = coverUrl ?? series.cover_url;
  const progressPercent =
    totalVolumes && totalVolumes > 0
      ? Math.min(Math.round((possessedCount / totalVolumes) * 100), 100)
      : null;

  const countLabel =
    totalVolumes !== null
      ? `${possessedCount} / ${totalVolumes} vol.`
      : `${possessedCount} vol.`;

  return (
    <Link href={href} className="group flex flex-col gap-2">
      {/* Cover — ratio 2:3 */}
      <div
        className="relative overflow-hidden rounded-[calc(var(--radius)*2)] aspect-[2/3] w-full"
        style={{ background: 'var(--muted)' }}
      >
        {cover ? (
          <Image
            src={cover}
            alt={series.title}
            fill
            sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : (
          coverFallback
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 px-0.5">
        <p
          className="text-sm font-semibold leading-tight line-clamp-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
        >
          {series.title}
        </p>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          {countLabel}
        </p>

        {/* Progress bar — masquée si total inconnu */}
        {progressPercent !== null && (
          <div
            className="manga-progress"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${progressPercent}% de la collection possédée`}
          >
            <div
              className="manga-progress__fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>
    </Link>
  );
}
