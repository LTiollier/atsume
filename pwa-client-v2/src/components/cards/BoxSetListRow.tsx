import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package2, ChevronRight, Heart } from 'lucide-react';

import type { BoxSet } from '@/types/volume';

// ─── Fallback hoisted (rendering-hoist-jsx) ───────────────────────────────────
const listRowFallback = (
  <div className="absolute inset-0 flex items-center justify-center">
    <Package2 size={16} aria-hidden style={{ color: 'var(--muted-foreground)' }} />
  </div>
);

interface BoxSetListRowProps {
  boxSet:   BoxSet;
  seriesId: number;
}

// ─── Défini au module level (rerender-no-inline-components) + memo (rerender-memo)
export const BoxSetListRow = memo(function BoxSetListRow({ boxSet, seriesId }: BoxSetListRowProps) {
  const ownedCount = boxSet.boxes.filter(b => b.is_owned).length;
  const totalCount = boxSet.boxes.length;
  const countLabel = `${ownedCount} / ${totalCount} boîte${totalCount > 1 ? 's' : ''}`;
  const pct        = totalCount > 0 ? Math.min((ownedCount / totalCount) * 100, 100) : 0;

  return (
    <div
      className="flex items-center gap-3 py-3 border-b last:border-b-0 group"
      style={{ borderColor: 'var(--border)' }}
    >
      <Link
        href={`/series/${seriesId}/box-set/${boxSet.id}`}
        className="flex items-center gap-3 flex-1 min-w-0"
        aria-label={`Voir le coffret ${boxSet.title} — ${countLabel}`}
      >
        {/* Thumbnail */}
        <div
          className="shrink-0 w-12 relative overflow-hidden"
          style={{ aspectRatio: '2/3', background: 'var(--muted)', borderRadius: 'var(--radius)' }}
        >
          {boxSet.cover_url ? (
            <Image src={boxSet.cover_url} alt={boxSet.title} fill sizes="48px" className="object-cover" />
          ) : listRowFallback}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold truncate leading-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
          >
            {boxSet.title}
          </p>
          {boxSet.publisher ? (
            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted-foreground)' }}>
              {boxSet.publisher}
            </p>
          ) : null}
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {countLabel}
          </p>
          {totalCount > 0 ? (
            <div
              className="volume-progress mt-1.5"
              role="progressbar"
              aria-valuenow={Math.round(pct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={countLabel}
            >
              <div className="volume-progress__fill" style={{ width: `${pct}%` }} />
            </div>
          ) : null}
        </div>
      </Link>

      {/* Wishlist indicator (read-only) or chevron */}
      {boxSet.is_wishlisted ? (
        <Heart
          size={14}
          fill="var(--color-wishlist)"
          style={{ color: 'var(--color-wishlist)' }}
          aria-label="En wishlist"
          className="shrink-0"
        />
      ) : (
        <ChevronRight
          size={14}
          aria-hidden
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: 'var(--muted-foreground)' }}
        />
      )}
    </div>
  );
});
