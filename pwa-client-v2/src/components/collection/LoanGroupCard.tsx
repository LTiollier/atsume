'use client';

import { memo, useState } from 'react';
import { differenceInDays, format } from 'date-fns';
import { Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useReturnLoan } from '@/hooks/queries';
import { useOffline } from '@/contexts/OfflineContext';
import type { Loan } from '@/types/volume';

const OVERDUE_DAYS = 30;

interface LoanGroupCardProps {
  loan: Loan;
  isHistory?: boolean;
}

/**
 * LoanGroupCard — affiche un prêt groupé avec ses N items.
 * Wrappé dans React.memo avec comparaison ciblée (rerender-memo).
 */
export const LoanGroupCard = memo(function LoanGroupCard({
  loan,
  isHistory = false,
}: LoanGroupCardProps) {
  const { mutate, isPending } = useReturnLoan();
  const { isOffline } = useOffline();
  const [isOpen, setIsOpen] = useState(false);

  const daysActive = differenceInDays(new Date(), new Date(loan.loaned_at));
  const isOverdue = !isHistory && !loan.is_returned && daysActive >= OVERDUE_DAYS;

  const itemTitles = loan.items
    .map(item => item.loanable?.title ?? '?')
    .join(' · ');

  const hasManyItems = loan.items.length > 1;

  return (
    <div
      className="flex flex-col p-4 border-b last:border-b-0"
      style={{ borderColor: 'var(--border)', opacity: isHistory ? 0.65 : 1 }}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => hasManyItems && setIsOpen(!isOpen)}
          className={`flex-1 min-w-0 text-left flex items-start gap-2 ${hasManyItems ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-default'}`}
          disabled={!hasManyItems}
          aria-expanded={isOpen}
          aria-label={hasManyItems ? `${isOpen ? 'Masquer' : 'Voir'} les tomes de ${loan.borrower_name}` : `Prêt de ${loan.borrower_name}`}
        >
          <div className="flex-1 min-w-0">
            {/* Borrower name */}
            <p
              className="text-sm font-semibold truncate"
              style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}
            >
              {loan.borrower_name}
            </p>

            {/* Item titles */}
            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted-foreground)' }}>
              {hasManyItems && !isOpen ? `${loan.items.length} tomes prêtés` : loan.items.length > 0 ? itemTitles : 'Aucun élément'}
            </p>

            {/* Duration + overdue badge */}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span
                className="text-xs"
                style={{ color: isOverdue ? 'var(--destructive)' : 'var(--muted-foreground)' }}
              >
                {isHistory && loan.returned_at
                  ? `Rendu le ${format(new Date(loan.returned_at), 'dd/MM/yy')}`
                  : `${daysActive} jour${daysActive > 1 ? 's' : ''}`}
              </span>

              {isOverdue && (
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none"
                  style={{
                    background: 'color-mix(in oklch, var(--destructive) 15%, transparent)',
                    color: 'var(--destructive)',
                    border: '1px solid color-mix(in oklch, var(--destructive) 30%, transparent)',
                  }}
                >
                  En retard
                </span>
              )}

              {hasManyItems && (
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded-full leading-none"
                  style={{
                    background: 'color-mix(in oklch, var(--primary) 12%, transparent)',
                    color: 'var(--primary)',
                    border: '1px solid color-mix(in oklch, var(--primary) 25%, transparent)',
                  }}
                >
                  {loan.items.length} éléments
                </span>
              )}
            </div>
          </div>
          
          {hasManyItems && (
            <ChevronDown
              size={16}
              className="shrink-0 mt-0.5"
              style={{
                color: 'var(--muted-foreground)',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 200ms ease-out',
              }}
              aria-hidden
            />
          )}
        </button>

        {/* Return button (active loans only) */}
        {!isHistory && (
          <button
            type="button"
            onClick={() => mutate(loan.id)}
            disabled={isPending || loan.is_returned || isOffline}
            className="shrink-0 text-xs font-medium h-8 px-3 transition-opacity disabled:opacity-50 hover:opacity-80"
            style={{
              background: 'var(--secondary)',
              color: 'var(--foreground)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
            }}
          >
            {isPending ? <Loader2 size={12} className="animate-spin" aria-hidden /> : 'Rendu'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && hasManyItems && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="mt-3 pt-3 border-t flex flex-col gap-1.5" style={{ borderColor: 'var(--border)' }}>
              {loan.items.map(item => (
                <div 
                  key={item.id} 
                  className="text-sm px-3 py-2 rounded-md"
                  style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}
                >
                  <span className="font-medium text-xs leading-none">{item.loanable?.title ?? 'Tome inconnu'}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
},
(prev, next) =>
  prev.loan.id === next.loan.id &&
  prev.loan.returned_at === next.loan.returned_at,
);
