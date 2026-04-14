import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, ChevronRight, Heart } from 'lucide-react';

import { editionReleasedTotal } from '@/lib/collection';
import type { Edition } from '@/types/volume';

// ─── Fallback hoisted (rendering-hoist-jsx) ───────────────────────────────────
const listRowFallback = (
  <div className="absolute inset-0 flex items-center justify-center">
    <Package size={16} aria-hidden style={{ color: 'var(--muted-foreground)' }} />
  </div>
);

interface EditionListRowProps {
  edition:           Edition;
  seriesId:          number;
  onToggleWishlist?: () => void;
  wishlistPending?:  boolean;
}

// ─── Défini au module level (rerender-no-inline-components) + memo (rerender-memo)
export const EditionListRow = memo(function EditionListRow({
  edition,
  seriesId,
  onToggleWishlist,
  wishlistPending = false,
}: EditionListRowProps) {
  const possessed = edition.possessed_count ?? 0;
  const total     = editionReleasedTotal(edition);
  const countLabel = total !== null ? `${possessed} / ${total} vol.` : `${possessed} vol.`;
  const pct        = total && total > 0 ? Math.min((possessed / total) * 100, 100) : 0;
  const canWishlist = possessed === 0 && !!onToggleWishlist;

  return (
    <div
      className="flex items-center gap-3 py-3 border-b last:border-b-0 group"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Main link — takes all available space */}
      <Link
        href={`/series/${seriesId}/edition/${edition.id}`}
        className="flex items-center gap-3 flex-1 min-w-0"
        aria-label={`Voir l'édition ${edition.name} — ${countLabel}`}
      >
        {/* Thumbnail */}
        <div
          className="shrink-0 w-12 relative overflow-hidden"
          style={{ aspectRatio: '2/3', background: 'var(--muted)', borderRadius: 'var(--radius)' }}
        >
          {edition.cover_url ? (
            <Image src={edition.cover_url} alt={edition.name} fill sizes="48px" className="object-cover" />
          ) : listRowFallback}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold truncate leading-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
          >
            {edition.name}
          </p>
          {edition.publisher ? (
            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted-foreground)' }}>
              {edition.publisher}
            </p>
          ) : null}
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {countLabel}
            <span className="opacity-70 before:content-['·'] before:mx-1">
              {edition.is_finished ? 'Terminée' : 'En cours'}
            </span>
          </p>
          {total !== null && total > 0 ? (
            <div
              className="volume-progress mt-1.5"
              role="progressbar"
              aria-valuenow={Math.round(pct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${possessed} / ${total} tomes possédés`}
            >
              <div className="volume-progress__fill" style={{ width: `${pct}%` }} />
            </div>
          ) : null}
        </div>
      </Link>

      {/* Chevron or wishlist button — mutually exclusive (rendering-conditional-render) */}
      {canWishlist ? (
        <button
          type="button"
          onClick={onToggleWishlist}
          disabled={wishlistPending}
          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-opacity disabled:opacity-50 hover:opacity-80"
          aria-label={edition.is_wishlisted ? 'Retirer de la wishlist' : 'Ajouter à la wishlist'}
        >
          <Heart
            size={14}
            fill={edition.is_wishlisted ? 'var(--color-wishlist)' : 'none'}
            style={{ color: edition.is_wishlisted ? 'var(--color-wishlist)' : 'var(--muted-foreground)' }}
            aria-hidden
          />
        </button>
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
