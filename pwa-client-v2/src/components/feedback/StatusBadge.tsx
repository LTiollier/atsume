import { cn } from '@/lib/utils';

// Hoisted config — jamais recréée (rendering-hoist-jsx + js-index-maps)
const BADGE_CONFIG = {
  read:     { label: 'Lu',       token: '--color-read'     },
  loaned:   { label: 'Prêté',    token: '--color-loaned'   },
  wishlist: { label: 'Wishlist', token: '--color-wishlist' },
  owned:    { label: 'Possédé',  token: '--color-owned'    },
} as const satisfies Record<string, { label: string; token: string }>;

export type StatusVariant = keyof typeof BADGE_CONFIG;

interface StatusBadgeProps {
  variant: StatusVariant;
  /** 'badge' (défaut) — dot + label pill · 'dot' — dot seul */
  display?: 'badge' | 'dot';
  className?: string;
}

/**
 * StatusBadge — indicateur visuel de statut d'un volume.
 * Server Component — aucun JS client.
 *
 * Variantes :
 *   read     → vert  (--color-read)
 *   loaned   → ambre (--color-loaned)
 *   wishlist → violet (--color-wishlist)
 *   owned    → cyan  (--color-owned)
 */
export function StatusBadge({ variant, display = 'badge', className }: StatusBadgeProps) {
  const { label, token } = BADGE_CONFIG[variant];
  const color = `var(${token})`;

  if (display === 'dot') {
    return (
      <span
        className={cn('status-dot', className)}
        style={{ background: color }}
        aria-label={label}
        title={label}
      />
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium leading-none',
        className,
      )}
      style={{
        background: `color-mix(in oklch, ${color} 15%, transparent)`,
        color,
        border: `1px solid color-mix(in oklch, ${color} 30%, transparent)`,
      }}
    >
      <span className="status-dot" style={{ background: color }} aria-hidden />
      {label}
    </span>
  );
}
