'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { bottomSheetVariants, bottomSheetOverlayVariants } from '@/lib/motion';

// Hoisted — pill handle identique sur chaque sheet (rendering-hoist-jsx)
const handlePill = (
  <div className="flex justify-center pt-3 pb-1 shrink-0" aria-hidden>
    <div
      className="rounded-full"
      style={{
        width: 40,
        height: 4,
        background: 'var(--muted-foreground)',
        opacity: 0.4,
      }}
    />
  </div>
);

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Hauteur max — défaut 80vh (spec §6.4) */
  maxHeight?: string;
}

/**
 * BottomSheet — sheet mobile slide-up avec swipe-to-dismiss.
 * Spec rapport.md §6.4.
 *
 * - Animation : bottomSheetVariants (spring stiffness 400, damping 40)
 * - Overlay   : bottomSheetOverlayVariants (fade 200ms)
 * - Swipe     : drag="y", ferme si offset > 80px ou velocity > 300px/s
 * - Scroll    : body scroll verrouillé à l'ouverture (useEffect — sync DOM externe)
 * - Portal    : rendu dans document.body pour z-index correct
 *
 * Pattern `rerender-use-ref-transient-values` : la valeur drag n'est PAS
 * mise en state — elle est lue directement depuis l'event onDragEnd.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
  maxHeight = '80vh',
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Verrouiller le scroll du body quand la sheet est ouverte (sync DOM externe)
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  // Fermeture au clavier Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay — tap pour fermer */}
          <motion.div
            key="overlay"
            variants={bottomSheetOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-40"
            style={{ background: 'oklch(0% 0 0 / 0.55)' }}
            onClick={onClose}
            aria-hidden
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={title ?? 'Panneau'}
            variants={bottomSheetVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.25 }}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              // Fermer si tiré vers le bas > 80px OU vitesse > 300px/s
              if (info.offset.y > 80 || info.velocity.y > 300) {
                onClose();
              }
            }}
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[12px] safe-area-bottom"
            style={{
              background: 'var(--popover)',
              maxHeight,
              boxShadow: 'var(--shadow-sheet)',
              touchAction: 'none', // évite les conflits avec le scroll natif
            }}
          >
            {/* Handle pill */}
            {handlePill}

            {/* Titre optionnel */}
            {title && (
              <div className="px-5 pb-2 pt-1 shrink-0">
                <h2
                  className="text-base font-semibold leading-tight"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
                >
                  {title}
                </h2>
              </div>
            )}

            {/* Contenu scrollable */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain px-5 pb-5"
              style={{ touchAction: 'pan-y' }} // réactive le scroll vertical dans le contenu
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
