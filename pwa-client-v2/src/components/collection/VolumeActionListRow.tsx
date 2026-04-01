'use client';

import Image from 'next/image';
import { BookOpen, BookUp, CheckCircle, Package } from 'lucide-react';

import { formatShortDate, isFutureDate } from '@/lib/utils';
import type { Volume } from '@/types/volume';

// ─── Fallback hoisted (rendering-hoist-jsx) ───────────────────────────────────
const listRowFallback = (
  <div className="absolute inset-0 flex items-center justify-center">
    <Package size={16} aria-hidden style={{ color: 'var(--muted-foreground)' }} />
  </div>
);

export interface VolumeActionListRowProps {
  volume:      Volume;
  isRead:      boolean;
  isLoaned:    boolean;
  isSelected?: boolean;
  onToggle:    (volume: Volume) => void;
}

// ─── Défini au module level (rerender-no-inline-components)
export function VolumeActionListRow({
  volume,
  isRead,
  isLoaned,
  isSelected = false,
  onToggle,
}: VolumeActionListRowProps) {
  const isFuture  = isFutureDate(volume.published_date);
  const isOwned   = volume.is_owned;

  return (
    <button
      type="button"
      className="flex items-center gap-3 w-full py-3 border-b last:border-b-0 text-left transition-colors"
      style={{
        borderColor: 'var(--border)',
        background: isSelected ? 'color-mix(in oklch, var(--primary) 10%, transparent)' : 'transparent',
      }}
      onClick={() => onToggle(volume)}
      aria-pressed={isSelected}
      aria-label={`${volume.title}${volume.number ? ` — tome ${volume.number}` : ''}${isLoaned ? ' — prêté' : ''}`}
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
        {volume.cover_url ? (
          <Image
            src={volume.cover_url}
            alt={volume.title ?? `Tome ${volume.number}`}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : listRowFallback}

        {/* Selected check overlay */}
        {isSelected && (
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ background: 'color-mix(in oklch, var(--primary) 40%, transparent)' }}
          >
            <CheckCircle size={14} style={{ color: 'white' }} />
          </div>
        )}
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
          {volume.number ? `#${volume.number} — ` : ''}{volume.title}
        </p>
        {isFuture ? (
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-upcoming)' }}>
            {formatShortDate(volume.published_date!)}
          </p>
        ) : null}
      </div>

      {/* Status badges (right side) — rendering-conditional-render : ternaires, pas && */}
      {!isSelected ? (
        <div className="shrink-0 flex items-center gap-1.5">
          {isRead ? (
            <span
              className="flex items-center justify-center w-[22px] h-[22px] rounded"
              style={{ background: 'var(--color-read)' }}
              aria-label="Lu"
            >
              <BookOpen size={12} style={{ color: 'var(--background)' }} aria-hidden />
            </span>
          ) : null}
          {isLoaned ? (
            <span
              className="flex items-center justify-center w-[22px] h-[22px] rounded"
              style={{ background: 'var(--color-loaned)' }}
              aria-label="Prêté"
            >
              <BookUp size={12} style={{ color: 'var(--background)' }} aria-hidden />
            </span>
          ) : null}
          {!isOwned ? (
            <span
              className="px-1.5 py-0.5 text-[10px] font-semibold rounded"
              style={{
                background: 'color-mix(in oklch, var(--muted-foreground) 15%, transparent)',
                color: 'var(--muted-foreground)',
              }}
            >
              Manquant
            </span>
          ) : null}
        </div>
      ) : null}
    </button>
  );
}
