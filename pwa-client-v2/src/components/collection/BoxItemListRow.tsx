'use client';

import Image from 'next/image';
import { CheckCircle, Heart, Package2 } from 'lucide-react';

import type { Box } from '@/types/volume';

// ─── Fallback hoisted (rendering-hoist-jsx) ───────────────────────────────────
const listRowFallback = (
  <div className="absolute inset-0 flex items-center justify-center">
    <Package2 size={16} aria-hidden style={{ color: 'var(--muted-foreground)' }} />
  </div>
);

export interface BoxItemListRowProps {
  box:               Box;
  isLoaned:          boolean;
  isSelected?:       boolean;
  onToggle:          (box: Box) => void;
  isWishlisted?:     boolean;
  onToggleWishlist?: () => void;
  wishlistPending?:  boolean;
}

// ─── Défini au module level (rerender-no-inline-components)
export function BoxItemListRow({
  box,
  isLoaned,
  isSelected       = false,
  onToggle,
  isWishlisted     = false,
  onToggleWishlist,
  wishlistPending  = false,
}: BoxItemListRowProps) {
  const isOwned     = box.is_owned ?? false;
  const volumeCount = box.total_volumes ?? box.volumes?.length;
  const metaParts   = [
    box.number ? `Boîte ${box.number}` : null,
    volumeCount ? `${volumeCount} vol.` : null,
  ].filter(Boolean);
  const metaLine = metaParts.join(' · ') || null;

  return (
    // Use wrapper div to avoid nested interactive elements (WishlistButton + toggle button)
    <div
      className="flex items-center gap-3 py-3 border-b last:border-b-0"
      style={{
        borderColor: 'var(--border)',
        background: isSelected ? 'color-mix(in oklch, var(--primary) 10%, transparent)' : 'transparent',
      }}
    >
      {/* Toggle button — main row area */}
      <button
        type="button"
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
        style={{ cursor: 'pointer' }}
        onClick={() => onToggle(box)}
        aria-pressed={isSelected}
        aria-label={`${box.title}${isLoaned ? ' — prêté' : ''}`}
      >
        {/* Thumbnail */}
        <div
          className="shrink-0 w-10 relative overflow-hidden"
          style={{
            aspectRatio: '2/3',
            background: 'var(--muted)',
            borderRadius: 'var(--radius)',
            filter: !isOwned && !isSelected ? 'grayscale(70%) brightness(0.7)' : undefined,
          }}
        >
          {box.cover_url ? (
            <Image
              src={box.cover_url}
              alt={box.title}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : listRowFallback}

          {/* Selected overlay */}
          {isSelected && (
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ background: 'color-mix(in oklch, var(--primary) 40%, transparent)' }}
            >
              <CheckCircle size={14} style={{ color: 'white' }} />
            </div>
          )}

          {/* Loaned dot */}
          {isLoaned && !isSelected ? (
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ background: 'var(--color-loaned)' }}
              aria-label="Prêté"
            />
          ) : null}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold truncate leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              color: isOwned ? 'var(--foreground)' : 'var(--muted-foreground)',
            }}
          >
            {box.title}
          </p>
          {metaLine ? (
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              {metaLine}
            </p>
          ) : null}
          {!isOwned ? (
            <span
              className="inline-block px-1.5 py-0.5 mt-0.5 text-[10px] font-semibold rounded"
              style={{
                background: 'color-mix(in oklch, var(--muted-foreground) 15%, transparent)',
                color: 'var(--muted-foreground)',
              }}
            >
              Manquant
            </span>
          ) : null}
        </div>
      </button>

      {/* Wishlist button — only for non-owned boxes (rendering-conditional-render) */}
      {!isOwned && onToggleWishlist ? (
        <button
          type="button"
          onClick={onToggleWishlist}
          disabled={wishlistPending}
          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-opacity disabled:opacity-50 hover:opacity-80"
          aria-label={isWishlisted ? 'Retirer de la wishlist' : 'Ajouter à la wishlist'}
        >
          <Heart
            size={14}
            fill={isWishlisted ? 'var(--color-wishlist)' : 'none'}
            style={{ color: isWishlisted ? 'var(--color-wishlist)' : 'var(--muted-foreground)' }}
            aria-hidden
          />
        </button>
      ) : null}
    </div>
  );
}
