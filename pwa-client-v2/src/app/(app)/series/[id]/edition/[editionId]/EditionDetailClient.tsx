'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { toast } from 'sonner';

import {
  useEditionQuery,
  useReadingProgressQuery,
  useLoansQuery,
  useBulkToggleReadingProgress,
  useBulkCreateLoan,
  useAddBulkToCollection,
  useBulkRemoveVolumesFromCollection,
  queryKeys,
} from '@/hooks/queries';
import { getApiErrorMessage } from '@/lib/error';
import { useMultiselect } from '@/hooks/useMultiselect';
import { useLoanSheet } from '@/hooks/useLoanSheet';
import { BackNav } from '@/components/collection/BackNav';
import { DetailHeader, gridSkeleton } from '@/components/collection/DetailHeader';
import { UnifiedActionBar } from '@/components/collection/UnifiedActionBar';
import { LoanSheet } from '@/components/collection/LoanSheet';
import { VolumeActionCard } from '@/components/collection/VolumeActionCard';
import { ConfirmationDialog } from '@/components/feedback/ConfirmationDialog';
import { EmptyState } from '@/components/feedback/EmptyState';
import { useConfirmationDialog } from '@/hooks/useConfirmationDialog';
import { sectionVariants } from '@/lib/motion';
import type { Loan, Volume } from '@/types/volume';

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
  const addBulk = useAddBulkToCollection();
  const bulkRemove = useBulkRemoveVolumesFromCollection();

  // Derived during render (rerender-derived-state-no-effect)
  // Wrapped in useMemo to stabilize the reference for dependent memos (rerender-memo)
  const volumes: Volume[] = useMemo(() => edition?.volumes ?? [], [edition?.volumes]);

  // O(1) lookup sets (js-set-map-lookups)
  const readSet = useMemo(
    () => new Set(readingProgress.map(p => p.volume_id)),
    [readingProgress],
  );

  const loanedSet = useMemo(
    () => new Set(
      loans
        .filter((l): l is Loan & { loanable_type: 'volume' } => !l.is_returned && l.loanable_type === 'volume')
        .map(l => l.loanable_id)
    ),
    [loans],
  );

  const ownedSet = useMemo(() => new Set(volumes.filter(v => v.is_owned).map(v => v.id)), [volumes]);
  const nonOwnedVolumes = useMemo(() => volumes.filter(v => !v.is_owned), [volumes]);

  // Unified selection over all volumes (rerender-memo)
  const { selectedIds, handleToggle, selectMany, clearSelection } = useMultiselect(volumes);

  // Derived owned/non-owned from unified selection (rerender-derived-state)
  const selectedOwned = useMemo(
    () => [...selectedIds].filter(id => ownedSet.has(id)),
    [selectedIds, ownedSet],
  );
  const selectedNonOwned = useMemo(
    () => [...selectedIds].filter(id => !ownedSet.has(id)),
    [selectedIds, ownedSet],
  );

  const ownedSelectedUnread = useMemo(
    () => selectedOwned.filter(id => !readSet.has(id)),
    [selectedOwned, readSet],
  );

  const { isLoanOpen, borrowerName, setBorrowerName, openLoanSheet, closeLoanSheet } = useLoanSheet();
  const { isOpen, setIsOpen, confirm, handleConfirm, config } = useConfirmationDialog();

  // Progress for header
  const possessedCount = edition?.possessed_count ?? ownedSet.size;
  const totalVolumes = edition?.total_volumes ?? null;
  const progressValue = totalVolumes && totalVolumes > 0
    ? Math.round((possessedCount / totalVolumes) * 100)
    : null;

  function invalidateEdition() {
    queryClient.invalidateQueries({ queryKey: queryKeys.edition(editionId) });
  }

  // ── 3-state select-all cycle ─────────────────────────────────────────────────

  function handleSelectAll() {
    if (selectedIds.size === 0) {
      selectMany(volumes);
    } else if (selectedIds.size === volumes.length) {
      selectMany(nonOwnedVolumes);
    } else {
      clearSelection();
    }
  }

  const selectAllLabel =
    selectedIds.size === 0 ? 'Tout sélectionner'
    : selectedIds.size === volumes.length ? 'Seulement les manquants'
    : 'Tout désélectionner';

  // ── Actions ──────────────────────────────────────────────────────────────────

  function parseVolumeNumber(volume: Volume): number | null {
    const n = parseInt(volume.number ?? '');
    return isNaN(n) ? null : n;
  }

  function handleAddSelected(nonOwnedIds: number[]) {
    const numbers = nonOwnedIds
      .map(id => volumes.find(v => v.id === id))
      .map(v => (v ? parseVolumeNumber(v) : null))
      .filter((n): n is number => n !== null)
      .sort((a, b) => a - b);
    if (numbers.length === 0) return;
    addBulk.mutate({ editionId, numbers }, {
      onSuccess: () => {
        toast.success(`${numbers.length} tome${numbers.length > 1 ? 's' : ''} ajouté${numbers.length > 1 ? 's' : ''}`);
        clearSelection();
        invalidateEdition();
      },
      onError: err => toast.error(getApiErrorMessage(err, "Erreur lors de l'ajout")),
    });
  }

  function handleMarkSelected(ids: number[]) {
    if (ids.length === 0) return;
    bulkToggle(ids);
    clearSelection();
  }

  function handleRemoveSelected(ids: number[]) {
    if (ids.length === 0) return;
    confirm({
      title: 'Retirer de la collection ?',
      description: `Voulez-vous retirer les ${ids.length} tome${ids.length > 1 ? 's' : ''} sélectionné${ids.length > 1 ? 's' : ''} de votre collection ?`,
      onConfirm: () => {
        bulkRemove.mutate(ids, {
          onSuccess: () => {
            clearSelection();
            invalidateEdition();
          },
        });
      },
      confirmLabel: 'Retirer',
      variant: 'danger',
    });
  }

  function handleConfirmLoan() {
    if (!borrowerName.trim() || selectedOwned.length === 0) return;
    bulkCreateLoan.mutate(
      { volumeIds: selectedOwned, borrowerName: borrowerName.trim() },
      {
        onSuccess: () => {
          closeLoanSheet();
          clearSelection();
          invalidateEdition();
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <BackNav onClick={() => router.back()} label="Série" />

      {/* Edition header */}
      {isError ? (
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
        <DetailHeader
          isLoading={false}
          coverUrl={edition.cover_url}
          title={edition.name}
          subtitle={edition.publisher}
          progress={progressValue !== null ? {
            value: progressValue,
            label: `${possessedCount} / ${totalVolumes} vol. possédés`,
            ariaLabel: `${possessedCount} volumes sur ${totalVolumes} possédés`,
          } : null}
          fallbackIcon={<Package size={24} aria-hidden style={{ color: 'var(--muted-foreground)' }} />}
        />
      ) : (
        <DetailHeader
          isLoading={editionLoading}
          coverUrl={null}
          title=""
          fallbackIcon={<Package size={24} aria-hidden style={{ color: 'var(--muted-foreground)' }} />}
        />
      )}

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
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xs font-semibold uppercase"
              style={{ color: 'var(--muted-foreground)', letterSpacing: '0.08em' }}
            >
              {selectedIds.size > 0
                ? `${selectedIds.size} sélectionné${selectedIds.size > 1 ? 's' : ''}`
                : `Volumes (${volumes.length})`}
            </h2>
            {volumes.length > 0 && (
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs font-medium transition-opacity hover:opacity-70 cursor-pointer"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {selectAllLabel}
              </button>
            )}
          </div>

          <div className={`volume-grid ${selectedIds.size > 0 ? 'pb-28' : ''}`}>
            {volumes.map(volume => (
              <VolumeActionCard
                key={volume.id}
                volume={volume}
                isRead={readSet.has(volume.id)}
                isLoaned={loanedSet.has(volume.id)}
                isSelected={selectedIds.has(volume.id)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </motion.section>
      )}

      <UnifiedActionBar
        variant="edition"
        ownedSelected={selectedOwned}
        nonOwnedSelected={selectedNonOwned}
        onAdd={handleAddSelected}
        onMarkRead={handleMarkSelected}
        ownedSelectedUnread={ownedSelectedUnread}
        onLoan={() => openLoanSheet()}
        onRemove={handleRemoveSelected}
        addPending={addBulk.isPending}
        markPending={togglePending}
        removePending={bulkRemove.isPending}
        loanPending={bulkCreateLoan.isPending}
      />

      <LoanSheet
        open={isLoanOpen}
        onClose={closeLoanSheet}
        title={`Prêter ${selectedOwned.length} volume${selectedOwned.length > 1 ? 's' : ''}`}
        question={`À qui prêtez-vous ${selectedOwned.length > 1 ? 'ces volumes' : 'ce volume'} ?`}
        borrowerName={borrowerName}
        onBorrowerNameChange={setBorrowerName}
        onConfirm={handleConfirmLoan}
        isPending={bulkCreateLoan.isPending}
      />

      <ConfirmationDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        {...config!}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
