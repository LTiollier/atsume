'use client';

import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronLeft, Package, BookMarked, BookUp, CheckCircle, Loader2 } from 'lucide-react';

import {
  useEditionQuery,
  useReadingProgressQuery,
  useLoansQuery,
  useBulkToggleReadingProgress,
  useBulkCreateLoan,
  queryKeys,
} from '@/hooks/queries';
import type { Loan, Manga } from '@/types/manga';
import { BottomSheet } from '@/components/feedback/BottomSheet';
import { EmptyState } from '@/components/feedback/EmptyState';
import { sectionVariants } from '@/lib/motion';

// ─── Skeletons hoisted at module level (rendering-hoist-jsx) ─────────────────

const headerSkeleton = (
  <div className="flex gap-4" aria-busy aria-hidden>
    <div
      className="skeleton shrink-0 w-20 rounded-[calc(var(--radius)*2)]"
      style={{ aspectRatio: '2/3' }}
    />
    <div className="flex flex-col gap-2 pt-1 flex-1">
      <div className="skeleton h-5 w-2/3 rounded" />
      <div className="skeleton h-4 w-1/3 rounded" />
      <div className="skeleton h-[3px] w-full rounded-full mt-2" />
      <div className="skeleton h-3 w-1/4 rounded" />
    </div>
  </div>
);

const gridSkeleton = (
  <div className="manga-grid" aria-busy aria-hidden>
    {Array.from({ length: 12 }, (_, i) => (
      <div key={i} className="manga-card skeleton" aria-hidden />
    ))}
  </div>
);

const bottomGradient = (
  <div
    aria-hidden
    className="absolute inset-0 pointer-events-none"
    style={{ background: 'linear-gradient(to top, oklch(0% 0 0 / 0.65) 0%, transparent 55%)' }}
  />
);

const coverFallback = (
  <div className="absolute inset-0 flex items-center justify-center">
    <Package size={24} aria-hidden style={{ color: 'var(--muted-foreground)' }} />
  </div>
);

// ─── CollectionSelectBar — portal, deux actions (rerender-no-inline-components) ─

interface CollectionSelectBarProps {
  count: number;
  onMarkRead: () => void;
  onLoan: () => void;
  markPending: boolean;
}

function CollectionSelectBar({ count, onMarkRead, onLoan, markPending }: CollectionSelectBarProps) {
  if (typeof document === 'undefined' || count === 0) return null;
  return createPortal(
    <div
      className="fixed bottom-0 left-0 right-0 z-40 lg:left-64 px-4 pt-3"
      style={{
        paddingBottom: 'calc(64px + env(safe-area-inset-bottom) + 12px)',
        background: 'var(--background)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center gap-3">
        <p className="flex-1 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
          {count} sélectionné{count > 1 ? 's' : ''}
        </p>
        <button
          type="button"
          onClick={onMarkRead}
          disabled={markPending}
          className="flex items-center gap-1.5 h-10 px-4 text-sm font-semibold transition-opacity disabled:opacity-40 hover:opacity-90"
          style={{
            background: 'color-mix(in oklch, var(--primary) 12%, var(--card))',
            color: 'var(--primary)',
            border: '1px solid color-mix(in oklch, var(--primary) 30%, transparent)',
            borderRadius: 'var(--radius)',
          }}
        >
          {markPending
            ? <Loader2 size={13} className="animate-spin" aria-hidden />
            : <BookMarked size={13} aria-hidden />}
          Marquer
        </button>
        <button
          type="button"
          onClick={onLoan}
          className="flex items-center gap-1.5 h-10 px-4 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{
            background: 'var(--primary)',
            color: 'var(--primary-foreground)',
            borderRadius: 'var(--radius)',
          }}
        >
          <BookUp size={13} aria-hidden />
          Prêter
        </button>
      </div>
    </div>,
    document.body,
  );
}

// ─── VolumeActionCard — toujours en mode sélection (rerender-no-inline-components) ─

interface VolumeActionCardProps {
  manga: Manga;
  isRead: boolean;
  isLoaned: boolean;
  isSelected: boolean;
  onToggle: (manga: Manga) => void;
}

function VolumeActionCard({ manga, isRead, isLoaned, isSelected, onToggle }: VolumeActionCardProps) {
  return (
    <button
      type="button"
      className="manga-card block w-full"
      style={{ background: 'none', border: 'none', padding: 0, cursor: manga.is_owned ? 'pointer' : 'default' }}
      onClick={() => { if (manga.is_owned) onToggle(manga); }}
      aria-pressed={manga.is_owned ? isSelected : undefined}
      aria-label={`${manga.title}${manga.number ? ` — tome ${manga.number}` : ''}${isLoaned ? ' — prêté' : ''}`}
    >
      {manga.cover_url ? (
        <Image
          src={manga.cover_url}
          alt={manga.title ?? `Tome ${manga.number}`}
          fill
          sizes="(max-width: 480px) 33vw, (max-width: 768px) 25vw, 16vw"
          className="object-cover"
        />
      ) : (
        coverFallback
      )}

      {bottomGradient}

      {/* Non-owned overlay */}
      {!manga.is_owned && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'oklch(0% 0 0 / 0.45)' }}
        />
      )}

      {/* Loaned overlay — masqué si sélectionné */}
      {isLoaned && !isSelected && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'color-mix(in oklch, var(--color-loaned) 15%, transparent)' }}
        />
      )}

      {/* Selected overlay */}
      {isSelected && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          style={{ background: 'color-mix(in oklch, var(--primary) 35%, transparent)' }}
        >
          <CheckCircle size={20} style={{ color: 'white' }} />
        </div>
      )}

      {/* Dot Lu — masqué si sélectionné */}
      {isRead && !isSelected && (
        <span
          className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full shrink-0"
          style={{
            background: 'var(--color-read)',
            boxShadow: '0 0 0 1px color-mix(in oklch, var(--background) 80%, transparent)',
          }}
          aria-label="Lu"
        />
      )}

      {/* Dot Prêté — masqué si sélectionné */}
      {isLoaned && !isSelected && (
        <span
          className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full shrink-0"
          style={{
            background: 'var(--color-loaned)',
            boxShadow: '0 0 0 1px color-mix(in oklch, var(--background) 80%, transparent)',
          }}
          aria-label="Prêté"
        />
      )}

      {/* Volume number */}
      {manga.number && (
        <div className="absolute bottom-0 left-0 right-0 px-1.5 pb-1.5">
          <span
            className="text-[11px] font-medium leading-none"
            style={{ color: 'var(--foreground)', fontFamily: 'var(--font-mono)' }}
          >
            #{manga.number}
          </span>
        </div>
      )}
    </button>
  );
}

// ─── EditionDetailClient ─────────────────────────────────────────────────────

interface EditionDetailClientProps {
  seriesId: number;
  editionId: number;
}

export function EditionDetailClient({ seriesId: _seriesId, editionId }: EditionDetailClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Parallel queries — fired simultaneously (async-parallel)
  const { data: edition, isLoading: editionLoading, isError } = useEditionQuery(editionId);
  const { data: readingProgress = [] } = useReadingProgressQuery();
  const { data: loans = [] } = useLoansQuery();

  // Mutations
  const { mutate: bulkToggle, isPending: togglePending } = useBulkToggleReadingProgress();
  const bulkCreateLoan = useBulkCreateLoan();

  // Multiselect state
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<number>>(() => new Set());

  // Loan sheet state
  const [isLoanOpen, setIsLoanOpen] = useState(false);
  const [borrowerName, setBorrowerName] = useState('');

  // Derived during render (rerender-derived-state-no-effect)
  const volumes: Manga[] = edition?.volumes ?? [];

  // O(1) lookup sets (js-set-map-lookups)
  const readSet = useMemo(
    () => new Set(readingProgress.map(p => p.volume_id)),
    [readingProgress],
  );

  const activeVolumeLoans = useMemo(
    () => loans.filter((l): l is Loan & { loanable_type: 'volume' } =>
      !l.is_returned && l.loanable_type === 'volume'
    ),
    [loans],
  );

  const loanedSet = useMemo(
    () => new Set(activeVolumeLoans.map(l => l.loanable_id)),
    [activeVolumeLoans],
  );

  const ownedVolumes = useMemo(() => volumes.filter(v => v.is_owned), [volumes]);
  const allRead = ownedVolumes.length > 0 && ownedVolumes.every(v => readSet.has(v.id));

  // Progress for header
  const possessedCount = edition?.possessed_count ?? ownedVolumes.length;
  const totalVolumes = edition?.total_volumes ?? null;
  const progress =
    totalVolumes && totalVolumes > 0
      ? Math.round((possessedCount / totalVolumes) * 100)
      : null;

  function invalidateEdition() {
    queryClient.invalidateQueries({ queryKey: queryKeys.edition(editionId) });
  }

  function handleToggle(manga: Manga) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(manga.id)) next.delete(manga.id); else next.add(manga.id);
      return next;
    });
  }

  function handleSelectAll() {
    setSelectedIds(new Set(ownedVolumes.map(v => v.id)));
  }

  // Tout marquer — agit sur TOUS les volumes possédés
  function handleBulkReadToggleAll() {
    const targetIds = allRead
      ? ownedVolumes.map(v => v.id)
      : ownedVolumes.filter(v => !readSet.has(v.id)).map(v => v.id);
    if (targetIds.length > 0) bulkToggle(targetIds);
  }

  // Tout prêter — présélectionne les non prêtés et ouvre le sheet
  function handleBulkLoanAll() {
    setSelectedIds(new Set(ownedVolumes.filter(v => !loanedSet.has(v.id)).map(v => v.id)));
    setIsLoanOpen(true);
  }

  // Marquer — toggle sur la sélection courante
  function handleMarkSelected() {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    bulkToggle(ids);
    setSelectedIds(new Set());
  }

  function handleCloseLoanSheet() {
    setIsLoanOpen(false);
    setBorrowerName('');
  }

  function handleConfirmLoan() {
    if (!borrowerName.trim() || selectedIds.size === 0) return;
    const volumeIds = [...selectedIds];
    bulkCreateLoan.mutate(
      { volumeIds, borrowerName: borrowerName.trim() },
      {
        onSuccess: () => {
          handleCloseLoanSheet();
          setSelectedIds(new Set());
          invalidateEdition();
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Back nav */}
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm transition-opacity hover:opacity-70 w-fit -ml-0.5"
        style={{ color: 'var(--muted-foreground)' }}
        aria-label="Retour à la série"
      >
        <ChevronLeft size={16} aria-hidden />
        Série
      </button>

      {/* Edition header */}
      {editionLoading ? (
        headerSkeleton
      ) : isError ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm" style={{ color: 'var(--destructive)' }}>
            Impossible de charger cette édition.
          </p>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-medium transition-opacity hover:opacity-80 text-left"
            style={{ color: 'var(--primary)' }}
          >
            ← Retour
          </button>
        </div>
      ) : edition ? (
        <motion.div
          className="flex gap-4"
          variants={sectionVariants}
          initial="initial"
          animate="animate"
        >
          <div
            className="shrink-0 w-20 relative overflow-hidden rounded-[calc(var(--radius)*2)]"
            style={{ aspectRatio: '2/3', background: 'var(--muted)' }}
          >
            {edition.cover_url ? (
              <Image src={edition.cover_url} alt={edition.name} fill sizes="80px" className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package size={24} aria-hidden style={{ color: 'var(--muted-foreground)' }} />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center gap-1.5 min-w-0 flex-1">
            <h1
              className="text-xl font-bold leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              {edition.name}
            </h1>
            {edition.publisher && (
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {edition.publisher}
              </p>
            )}
            {progress !== null && (
              <>
                <div
                  className="manga-progress"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${possessedCount} volumes sur ${totalVolumes} possédés`}
                >
                  <div className="manga-progress__fill" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  {possessedCount} / {totalVolumes} vol. possédés
                </p>
              </>
            )}
          </div>
        </motion.div>
      ) : null}

      {/* Volume grid */}
      {editionLoading ? (
        gridSkeleton
      ) : volumes.length === 0 && !isError ? (
        <EmptyState context="collection" />
      ) : (
        <motion.section
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          aria-label="Volumes de l'édition"
        >
          {/* Section header */}
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xs font-semibold uppercase"
              style={{ color: 'var(--muted-foreground)', letterSpacing: '0.08em' }}
            >
              {selectedIds.size > 0
                ? `${selectedIds.size} sélectionné${selectedIds.size > 1 ? 's' : ''}`
                : `Volumes (${volumes.length})`}
            </h2>
            {ownedVolumes.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs font-medium transition-opacity hover:opacity-70"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Tout sélectionner
                </button>
                <button
                  type="button"
                  onClick={handleBulkReadToggleAll}
                  disabled={togglePending}
                  className="flex items-center gap-1 text-xs font-medium transition-opacity disabled:opacity-50 hover:opacity-80"
                  style={{ color: 'var(--primary)' }}
                >
                  <BookMarked size={11} aria-hidden />
                  {allRead ? 'Tout démarquer' : 'Tout marquer'}
                </button>
                <button
                  type="button"
                  onClick={handleBulkLoanAll}
                  className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-80"
                  style={{ color: 'var(--primary)' }}
                >
                  <BookUp size={11} aria-hidden />
                  Tout prêter
                </button>
              </div>
            )}
          </div>

          <div className={`manga-grid ${selectedIds.size > 0 ? 'pb-28' : ''}`}>
            {volumes.map(manga => (
              <VolumeActionCard
                key={manga.id}
                manga={manga}
                isRead={readSet.has(manga.id)}
                isLoaned={loanedSet.has(manga.id)}
                isSelected={selectedIds.has(manga.id)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* Barre de confirmation (portal) — visible quand sélection > 0 */}
      <CollectionSelectBar
        count={selectedIds.size}
        onMarkRead={handleMarkSelected}
        onLoan={() => setIsLoanOpen(true)}
        markPending={togglePending}
      />

      {/* Loan bottom sheet */}
      <BottomSheet
        open={isLoanOpen}
        onClose={handleCloseLoanSheet}
        title={`Prêter ${selectedIds.size} volume${selectedIds.size > 1 ? 's' : ''}`}
      >
        <div className="flex flex-col gap-4 pt-2">
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            À qui prêtez-vous {selectedIds.size > 1 ? 'ces volumes' : 'ce volume'} ?
          </p>
          <input
            type="text"
            value={borrowerName}
            onChange={e => setBorrowerName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleConfirmLoan(); }}
            placeholder="Nom de l'emprunteur"
            autoFocus
            className="w-full h-11 px-3 text-sm outline-none"
            style={{
              background: 'var(--input)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              borderRadius: 'var(--radius)',
            }}
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCloseLoanSheet}
              className="flex-1 h-10 text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                background: 'var(--secondary)',
                color: 'var(--foreground)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
              }}
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleConfirmLoan}
              disabled={!borrowerName.trim() || bulkCreateLoan.isPending}
              className="flex-1 h-10 text-sm font-semibold transition-opacity disabled:opacity-50 hover:opacity-80"
              style={{
                background: 'var(--primary)',
                color: 'var(--primary-foreground)',
                borderRadius: 'var(--radius)',
              }}
            >
              {bulkCreateLoan.isPending ? 'Enregistrement…' : 'Confirmer'}
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
