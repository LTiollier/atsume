'use client';

import { useState, useMemo, useDeferredValue } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useVolumes } from '@/hooks/queries';
import { isFutureDate } from '@/lib/utils';
import { CollectionStatBar, collectionStatBarSkeleton } from '@/components/collection/CollectionStatBar';
import { EmptyState } from '@/components/feedback/EmptyState';
import { SearchBar } from '@/components/forms/SearchBar';
import type { Edition, Series } from '@/types/volume';

// ─── Constants ────────────────────────────────────────────────────────────────

// ≤ this value (total volumes) → grid always visible (no accordion)
const GRID_INLINE_MAX_VOLUMES = 20;

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = 'missing' | 'progress' | 'alpha';

interface IncompleteEdition {
  editionId: number;
  editionName: string;
  series: Series;
  ownedCount: number;
  totalVolumes: number;
  missingCount: number;
  /** Specific missing volume numbers (1-based). Empty if hasNumberData is false. */
  missingNumbers: number[];
  /** True when all owned volumes had a parseable number — gaps can be computed reliably. */
  hasNumberData: boolean;
  coverUrl: string | null;
}

// ─── Hoisted static data (rendering-hoist-jsx + js-index-maps) ───────────────

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'missing',  label: 'Manquants'     },
  { key: 'progress', label: 'Presque finis' },
  { key: 'alpha',    label: 'A–Z'           },
];

// ─── Skeletons (rendering-hoist-jsx) ─────────────────────────────────────────

const completionSkeletons = (
  <>
    {collectionStatBarSkeleton}
    <div className="skeleton h-10 rounded mb-3" style={{ borderRadius: 'var(--radius)' }} aria-hidden />
    <div
      className="skeleton mb-4 rounded-[calc(var(--radius)*2)]"
      style={{ height: 34 }}
      aria-hidden
    />
    <div className="flex flex-col" aria-busy>
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-3 border-b last:border-b-0"
          style={{ borderColor: 'var(--border)' }}
          aria-hidden
        >
          <div className="skeleton shrink-0 w-10 rounded" style={{ aspectRatio: '2/3' }} />
          <div className="flex-1 flex flex-col gap-2">
            <div className="skeleton h-4 w-1/2 rounded" />
            <div className="skeleton h-3 w-1/3 rounded" />
            <div className="skeleton h-[3px] w-full rounded-full" />
          </div>
          <div className="skeleton h-6 w-12 rounded" />
        </div>
      ))}
    </div>
  </>
);

// ─── VolumeGrid (rerender-no-inline-components) ───────────────────────────────
// Shows all volumes (1 → totalVolumes) as a 10-column grid.
// Owned volumes → primary colour chip. Missing → muted grey chip.
// Falls back to a plain count when number data is unreliable.

interface VolumeGridProps {
  totalVolumes: number;
  missingNumbers: number[];
  hasData: boolean;
  missingCount: number;
  /** When provided, shows a "Voir l'édition" link at the end (accordion path only). */
  editionHref?: string;
}

function VolumeGrid({ totalVolumes, missingNumbers, hasData, missingCount, editionHref }: VolumeGridProps) {
  // O(1) membership check — built once per render (missingNumbers rarely changes)
  const missingSet = useMemo(() => new Set(missingNumbers), [missingNumbers]);

  return (
    <div className="pb-3 pl-[52px]">
      {hasData ? (
        <div
          role="list"
          aria-label="Tomes de l'édition"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
            gap: '3px',
          }}
        >
          {Array.from({ length: totalVolumes }, (_, i) => {
            const n = i + 1;
            const owned = !missingSet.has(n);
            return (
              <span
                key={n}
                role="listitem"
                aria-label={`Tome ${n} – ${owned ? 'possédé' : 'manquant'}`}
                className="text-center tabular-nums"
                style={
                  owned
                    ? {
                        fontSize: '10px',
                        fontWeight: 500,
                        padding: '2px 1px',
                        color: 'var(--primary)',
                        background: 'color-mix(in oklch, var(--primary) 12%, transparent)',
                        borderRadius: 'calc(var(--radius) * 0.5)',
                        border: '1px solid color-mix(in oklch, var(--primary) 25%, transparent)',
                      }
                    : {
                        fontSize: '10px',
                        fontWeight: 400,
                        padding: '2px 1px',
                        color: 'var(--muted-foreground)',
                        background: 'var(--muted)',
                        borderRadius: 'calc(var(--radius) * 0.5)',
                        border: '1px solid var(--border)',
                        opacity: 0.5,
                      }
                }
              >
                {n}
              </span>
            );
          })}
        </div>
      ) : (
        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          {missingCount} tome{missingCount > 1 ? 's' : ''} manquant{missingCount > 1 ? 's' : ''}
        </span>
      )}
      {editionHref && (
        <Link
          href={editionHref}
          className="inline-flex items-center gap-1 mt-2 text-xs font-medium transition-opacity hover:opacity-70"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Voir l&apos;édition
          <ArrowRight size={11} aria-hidden />
        </Link>
      )}
    </div>
  );
}

// ─── EditionRowHeader (rerender-no-inline-components) ────────────────────────

interface EditionRowHeaderProps {
  item: IncompleteEdition;
  showChevron: boolean;
  isOpen: boolean;
}

function EditionRowHeader({ item, showChevron, isOpen }: EditionRowHeaderProps) {
  const progress = Math.round((item.ownedCount / item.totalVolumes) * 100);

  return (
    <>
      {/* Cover */}
      <div
        className="shrink-0 w-10 relative overflow-hidden"
        style={{
          aspectRatio: '2/3',
          background: 'var(--muted)',
          borderRadius: 'var(--radius)',
        }}
      >
        {item.coverUrl ? (
          <Image src={item.coverUrl} alt={item.editionName} fill sizes="40px" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package size={14} aria-hidden style={{ color: 'var(--muted-foreground)' }} />
          </div>
        )}
      </div>

      {/* Info + progress bar */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate leading-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
        >
          {item.series.title}
        </p>
        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted-foreground)' }}>
          {item.editionName} · {item.ownedCount} / {item.totalVolumes}
        </p>
        <div
          className="volume-progress mt-1.5"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${progress}% possédé`}
        >
          <div className="volume-progress__fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Badge + optional chevron */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className="text-xs font-semibold px-2 py-0.5 tabular-nums"
          style={{
            color: 'var(--primary)',
            background: 'color-mix(in oklch, var(--primary) 15%, transparent)',
            borderRadius: 'var(--radius)',
            border: '1px solid color-mix(in oklch, var(--primary) 30%, transparent)',
          }}
        >
          -{item.missingCount}
        </span>
        {showChevron && (
          <ChevronDown
            size={14}
            aria-hidden
            style={{
              color: 'var(--muted-foreground)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 150ms ease-out',
              flexShrink: 0,
            }}
          />
        )}
      </div>
    </>
  );
}

// ─── EditionRow (rerender-no-inline-components) ───────────────────────────────

interface EditionRowProps {
  item: IncompleteEdition;
  isOpen: boolean;
  onToggle: () => void;
}

function EditionRow({ item, isOpen, onToggle }: EditionRowProps) {
  // Short series (≤ GRID_INLINE_MAX_VOLUMES total) → grid always visible, row links to edition page.
  // Long series (One Piece, etc.) → accordion so the page doesn't fill with grids.
  const isInline = item.totalVolumes <= GRID_INLINE_MAX_VOLUMES;
  const href = `/series/${item.series.id}/edition/${item.editionId}`;

  if (isInline) {
    return (
      <div className="border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
        <Link
          href={href}
          className="flex items-center gap-3 py-3 hover:opacity-80 transition-opacity"
        >
          <EditionRowHeader item={item} showChevron={false} isOpen={false} />
        </Link>
        <VolumeGrid
          totalVolumes={item.totalVolumes}
          missingNumbers={item.missingNumbers}
          hasData={item.hasNumberData}
          missingCount={item.missingCount}
        />
      </div>
    );
  }

  // Long series → accordion; editionHref shows a "Voir l'édition" link inside the expanded grid
  // (the toggle button itself can't also be a link)
  return (
    <div className="border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-3 py-3 w-full text-left"
        aria-expanded={isOpen}
        aria-label={`${item.series.title} \u2014 ${isOpen ? 'masquer' : 'voir'} la grille des tomes`}
      >
        <EditionRowHeader item={item} showChevron={true} isOpen={isOpen} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <VolumeGrid
              totalVolumes={item.totalVolumes}
              missingNumbers={item.missingNumbers}
              hasData={item.hasNumberData}
              missingCount={item.missingCount}
              editionHref={href}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── CompletionTab ─────────────────────────────────────────────────────────────

export function CompletionTab() {
  const { data: volumes = [], isLoading } = useVolumes();
  const [sortKey, setSortKey] = useState<SortKey>('missing');
  const [search, setSearch] = useState('');
  // Stores IDs of accordion rows the user has opened (js-set-map-lookups)
  const [openEditions, setOpenEditions] = useState<Set<number>>(new Set());

  // Functional setState for stable toggle (rerender-functional-setstate)
  function toggleEdition(id: number) {
    setOpenEditions(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Build incomplete editions — two-pass: collect then compute gaps (js-index-maps)
  // Uses the full volumes list (owned + non-owned) so future volumes the user hasn't
  // pre-ordered are still detected and excluded from the effective total.
  const incompleteEditions = useMemo<IncompleteEdition[]>(() => {
    // Pass 1: group volumes by edition, tracking released-owned vs any-unreleased
    const editionMap = new Map<number, {
      edition: Edition;
      series: Series;
      releasedOwnedCount: number;
      unreleasedCount: number;   // any volume (owned or not) with a future published_date
      ownedNumbers: Set<number>; // only released + owned
      coverUrl: string | null;
    }>();

    for (const v of volumes) {
      if (!v.edition || !v.series || v.edition.total_volumes == null) continue;
      const eid = v.edition.id;
      const unreleased = isFutureDate(v.published_date);
      const parsedNum = v.number != null ? parseInt(v.number, 10) : NaN;
      const entry = editionMap.get(eid);
      if (!entry) {
        editionMap.set(eid, {
          edition: v.edition,
          series: v.series,
          releasedOwnedCount: !unreleased && v.is_owned ? 1 : 0,
          unreleasedCount: unreleased ? 1 : 0,
          ownedNumbers: new Set(!unreleased && v.is_owned && !isNaN(parsedNum) ? [parsedNum] : []),
          coverUrl: v.cover_url ?? null,
        });
      } else {
        if (unreleased) {
          entry.unreleasedCount++;
        } else if (v.is_owned) {
          entry.releasedOwnedCount++;
          if (!isNaN(parsedNum)) entry.ownedNumbers.add(parsedNum);
        }
        if (!entry.coverUrl && v.cover_url) entry.coverUrl = v.cover_url;
      }
    }

    // Pass 2: compute missing count and specific numbers per edition
    // Use released_volumes from the API when available (server-computed, accurate).
    // Fall back to total_volumes - unreleasedCount (client-side heuristic for pre-ordered volumes).
    const result: IncompleteEdition[] = [];
    editionMap.forEach(({ edition, series, releasedOwnedCount, unreleasedCount, ownedNumbers, coverUrl }) => {
      const effectiveTotal = edition.released_volumes ?? (edition.total_volumes! - unreleasedCount);
      if (effectiveTotal <= 0) return;
      const missing = effectiveTotal - releasedOwnedCount;
      if (missing <= 0) return;

      // Specific numbers only trustworthy when all released owned volumes had parseable numbers
      const hasNumberData = ownedNumbers.size === releasedOwnedCount;
      const missingNumbers: number[] = [];
      if (hasNumberData) {
        for (let n = 1; n <= effectiveTotal; n++) {
          if (!ownedNumbers.has(n)) missingNumbers.push(n);
        }
      }

      result.push({
        editionId: edition.id,
        editionName: edition.name,
        series,
        ownedCount: releasedOwnedCount,
        totalVolumes: effectiveTotal,
        missingCount: missing,
        missingNumbers,
        hasNumberData,
        coverUrl,
      });
    });

    return result;
  }, [volumes]);

  // Sort — separate memo so stats don't recompute on sort change (rerender-split-combined-hooks)
  const sortedEditions = useMemo(() => {
    return [...incompleteEditions].sort((a, b) => {
      if (sortKey === 'missing')  return b.missingCount - a.missingCount;
      if (sortKey === 'progress') return (a.ownedCount / a.totalVolumes) - (b.ownedCount / b.totalVolumes);
      return a.series.title.localeCompare(b.series.title, 'fr');
    });
  }, [incompleteEditions, sortKey]);

  // Deferred search — keeps sort/filter non-blocking on large lists (rerender-use-deferred-value)
  const deferredSearch = useDeferredValue(search);
  const filteredEditions = useMemo(() => {
    if (!deferredSearch) return sortedEditions;
    const q = deferredSearch.toLowerCase();
    return sortedEditions.filter(
      e =>
        e.series.title.toLowerCase().includes(q) ||
        e.editionName.toLowerCase().includes(q),
    );
  }, [sortedEditions, deferredSearch]);

  // Stats — stable on sort changes (rerender-derived-state-no-effect)
  const seriesCount = useMemo(
    () => new Set(incompleteEditions.map(e => e.series.id)).size,
    [incompleteEditions],
  );

  const totalMissing = useMemo(
    () => incompleteEditions.reduce((sum, e) => sum + e.missingCount, 0),
    [incompleteEditions],
  );

  if (isLoading) return completionSkeletons;

  return (
    <div className="flex flex-col">
      <CollectionStatBar items={[
        { value: seriesCount, label: 'Séries à compléter' },
        { value: totalMissing, label: 'Tomes manquants' },
      ]} />

      {/* Search + sort — only shown when there is data */}
      {sortedEditions.length > 0 && (
        <>
          <SearchBar
            placeholder="Rechercher une série ou édition…"
            onChange={setSearch}
            onClear={() => setSearch('')}
            className="mb-3"
          />
          <div
            className="flex gap-1.5 mb-4 flex-wrap"
            role="group"
            aria-label="Trier la liste"
          >
            {SORT_OPTIONS.map(opt => {
              const isActive = sortKey === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSortKey(opt.key)}
                  className="text-xs font-medium px-3 py-1.5 transition-colors"
                  style={{
                    borderRadius: 'calc(var(--radius) * 2)',
                    background: isActive
                      ? 'color-mix(in oklch, var(--primary) 15%, transparent)'
                      : 'var(--secondary)',
                    color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                    border: `1px solid ${isActive
                      ? 'color-mix(in oklch, var(--primary) 30%, transparent)'
                      : 'var(--border)'}`,
                  }}
                  aria-pressed={isActive}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </>
      )}

      {sortedEditions.length === 0 ? (
        <EmptyState
          context="completion"
          action={{ label: 'Voir la collection', href: '/collection?tab=library' }}
        />
      ) : filteredEditions.length === 0 ? (
        <EmptyState context="search" />
      ) : (
        <div>
          {filteredEditions.map(item => (
            <EditionRow
              key={item.editionId}
              item={item}
              isOpen={openEditions.has(item.editionId)}
              onToggle={() => toggleEdition(item.editionId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
