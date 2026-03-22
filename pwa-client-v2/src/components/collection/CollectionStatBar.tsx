'use client';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatBarItem {
  value: number | string;
  label: string;
}

export interface CollectionStatBarProps {
  items: StatBarItem[];
}

// ─── Skeleton — hoisted at module level (rendering-hoist-jsx) ─────────────────

export const collectionStatBarSkeleton = (
  <div
    className="flex rounded-[calc(var(--radius)*2)] overflow-hidden mb-4"
    style={{ background: 'var(--muted)' }}
    aria-hidden
  >
    {[0, 1].map(i => (
      <div
        key={i}
        className="flex-1 flex flex-col gap-1.5 py-3 px-4"
        style={{ borderLeft: i > 0 ? '1px solid var(--border)' : undefined }}
      >
        <div className="skeleton h-7 w-10 rounded" />
        <div className="skeleton h-2.5 w-16 rounded" />
      </div>
    ))}
  </div>
);

// ─── CollectionStatBar ────────────────────────────────────────────────────────

/**
 * Bandeau de statistiques contextuel — affiché en haut de chaque onglet Collection.
 * 1 ou 2 métriques côte à côte, séparées par une bordure verticale.
 *
 * Hérite de l'animation fade du tabpanel AnimatePresence parent — pas d'animation propre.
 * Pattern rerender-no-inline-components : items.map sur des éléments simples, pas de sous-composants.
 */
export function CollectionStatBar({ items }: CollectionStatBarProps) {
  return (
    <div
      className="flex rounded-[calc(var(--radius)*2)] overflow-hidden mb-4"
      style={{ background: 'var(--muted)' }}
      role="status"
      aria-label="Statistiques de cet onglet"
    >
      {items.map((item, i) => {
        // Formatage numérique séparé du JSX (js-cache-property-access spirit)
        const displayValue =
          typeof item.value === 'number'
            ? item.value.toLocaleString('fr-FR')
            : item.value;

        return (
          <div
            key={i}
            className="flex-1 flex flex-col gap-0.5 py-3 px-4"
            style={{ borderLeft: i > 0 ? '1px solid var(--border)' : undefined }}
          >
            <span
              className="font-bold leading-none tabular-nums"
              style={{
                fontSize: 28,
                color: 'var(--foreground)',
                fontFamily: 'var(--font-display)',
              }}
            >
              {displayValue}
            </span>
            <span
              className="text-[11px] leading-none font-medium uppercase"
              style={{
                color: 'var(--muted-foreground)',
                letterSpacing: '0.06em',
                fontFamily: 'var(--font-body)',
              }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
