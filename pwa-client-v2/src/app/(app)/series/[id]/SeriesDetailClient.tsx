'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Package } from 'lucide-react';

import { useSeriesQuery } from '@/hooks/queries';
import { SeriesCard } from '@/components/cards/SeriesCard';
import { BoxCard } from '@/components/cards/BoxCard';
import { MangaGrid } from '@/components/cards/MangaGrid';
import { EmptyState } from '@/components/feedback/EmptyState';
import { sectionVariants } from '@/lib/motion';
import type { Edition, BoxSet } from '@/types/manga';

// ─── Skeletons hoisted at module level (rendering-hoist-jsx) ─────────────────

const headerSkeleton = (
  <div className="flex gap-4" aria-busy aria-hidden>
    <div
      className="skeleton shrink-0 w-20 rounded-[calc(var(--radius)*2)]"
      style={{ aspectRatio: '2/3' }}
    />
    <div className="flex flex-col gap-2 pt-1 flex-1">
      <div className="skeleton h-6 w-3/4 rounded" />
      <div className="skeleton h-4 w-1/2 rounded" />
    </div>
  </div>
);

const gridSkeleton = (
  <div
    className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4"
    aria-busy
    aria-hidden
  >
    {Array.from({ length: 3 }, (_, i) => (
      <div key={i} className="flex flex-col gap-2">
        <div
          className="skeleton rounded-[calc(var(--radius)*2)] w-full"
          style={{ aspectRatio: '2/3' }}
        />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
    ))}
  </div>
);

// ─── EditionCard — defined outside parent (rerender-no-inline-components) ────

interface EditionCardProps {
  edition: Edition;
  seriesId: number;
}

function EditionCard({ edition, seriesId }: EditionCardProps) {
  return (
    <SeriesCard
      series={{
        id: edition.id,
        title: edition.name,
        authors: null,
        cover_url: edition.cover_url ?? null,
      }}
      possessedCount={edition.possessed_count ?? 0}
      totalVolumes={edition.total_volumes}
      href={`/series/${seriesId}/edition/${edition.id}`}
      coverUrl={edition.cover_url}
    />
  );
}

// ─── BoxSetCard — defined outside parent (rerender-no-inline-components) ─────

interface BoxSetCardProps {
  boxSet: BoxSet;
  seriesId: number;
}

function BoxSetCard({ boxSet, seriesId }: BoxSetCardProps) {
  return (
    <BoxCard
      title={boxSet.title}
      coverUrl={boxSet.cover_url ?? null}
      href={`/series/${seriesId}/box-set/${boxSet.id}`}
      subtitle={boxSet.publisher ?? undefined}
      boxCount={boxSet.boxes.length}
      isWishlisted={boxSet.is_wishlisted}
    />
  );
}

// ─── SeriesDetailClient ───────────────────────────────────────────────────────

interface SeriesDetailClientProps {
  seriesId: number;
}

export function SeriesDetailClient({ seriesId }: SeriesDetailClientProps) {
  const router = useRouter();
  const { data: series, isLoading, isError } = useSeriesQuery(seriesId);

  // Derived during render — no useEffect (rerender-derived-state-no-effect)
  const editions: Edition[] = series?.editions ?? [];
  const boxSets: BoxSet[] = series?.box_sets ?? [];
  const hasContent = editions.length > 0 || boxSets.length > 0;
  const authorsLabel = series?.authors?.join(', ') ?? null;

  return (
    <div className="flex flex-col gap-8">
      {/* Back nav */}
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm transition-opacity hover:opacity-70 w-fit -ml-0.5"
        style={{ color: 'var(--muted-foreground)' }}
        aria-label="Retour"
      >
        <ChevronLeft size={16} aria-hidden />
        Collection
      </button>

      {/* Series header */}
      {isLoading ? (
        headerSkeleton
      ) : isError ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm" style={{ color: 'var(--destructive)' }}>
            Impossible de charger cette série.
          </p>
          <Link
            href="/collection"
            className="text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: 'var(--primary)' }}
          >
            ← Retour à la collection
          </Link>
        </div>
      ) : series ? (
        <motion.div
          className="flex gap-4"
          variants={sectionVariants}
          initial="initial"
          animate="animate"
        >
          {/* Cover */}
          <div
            className="shrink-0 w-20 relative overflow-hidden rounded-[calc(var(--radius)*2)]"
            style={{ aspectRatio: '2/3', background: 'var(--muted)' }}
          >
            {series.cover_url ? (
              <Image
                src={series.cover_url}
                alt={series.title}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package size={24} aria-hidden style={{ color: 'var(--muted-foreground)' }} />
              </div>
            )}
          </div>

          {/* Title + authors */}
          <div className="flex flex-col justify-center gap-1 min-w-0">
            <h1
              className="text-xl font-bold leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              {series.title}
            </h1>
            {authorsLabel && (
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {authorsLabel}
              </p>
            )}
          </div>
        </motion.div>
      ) : null}

      {/* Sections */}
      {isLoading ? (
        <div className="flex flex-col gap-8">
          <div>
            <div className="skeleton h-4 w-24 rounded mb-4" aria-hidden />
            {gridSkeleton}
          </div>
        </div>
      ) : !hasContent && !isError ? (
        <EmptyState context="collection" />
      ) : (
        <>
          {/* Editions */}
          {editions.length > 0 && (
            <motion.section
              variants={sectionVariants}
              initial="initial"
              animate="animate"
              aria-label="Éditions"
            >
              <h2
                className="text-xs font-semibold uppercase mb-4"
                style={{ color: 'var(--muted-foreground)', letterSpacing: '0.08em' }}
              >
                Éditions ({editions.length})
              </h2>
              <MangaGrid variant="series">
                {editions.map(edition => (
                  <EditionCard key={edition.id} edition={edition} seriesId={seriesId} />
                ))}
              </MangaGrid>
            </motion.section>
          )}

          {/* Box-sets */}
          {boxSets.length > 0 && (
            <motion.section
              variants={sectionVariants}
              initial="initial"
              animate="animate"
              aria-label="Coffrets"
            >
              <h2
                className="text-xs font-semibold uppercase mb-4"
                style={{ color: 'var(--muted-foreground)', letterSpacing: '0.08em' }}
              >
                Coffrets ({boxSets.length})
              </h2>
              <MangaGrid variant="series">
                {boxSets.map(boxSet => (
                  <BoxSetCard key={boxSet.id} boxSet={boxSet} seriesId={seriesId} />
                ))}
              </MangaGrid>
            </motion.section>
          )}
        </>
      )}
    </div>
  );
}
