'use client';

import * as React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  icon?: 'alert' | 'help';
}

/**
 * ConfirmationDialog — Dialog de confirmation centralisé et redessiné.
 * Structure ultra-stable utilisant les conteneurs Radix par défaut
 * pour éviter toute erreur de "React.Children.only".
 */
export const ConfirmationDialog = React.memo(({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'primary',
  icon = 'help',
}: ConfirmationDialogProps) => {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <AlertDialog.Portal forceMount>
            {/* Overlay avec animation interne */}
            <AlertDialog.Overlay className="fixed inset-0 z-50 overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full bg-black/80 backdrop-blur-md"
              />
            </AlertDialog.Overlay>

            {/* Conteneur de modal avec animation du contenu */}
            <AlertDialog.Content 
              className="fixed inset-0 z-51 flex items-center justify-center p-6 outline-none pointer-events-none"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="w-full max-w-[340px] pointer-events-auto"
              >
                <div 
                  className="overflow-hidden rounded-[28px] p-7 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-border/50 bg-card"
                  style={{ backgroundColor: 'var(--card)' }}
                >
                  <div className="flex flex-col items-center text-center gap-6">
                    {/* Icon Section */}
                    <div 
                      className={cn(
                        "flex items-center justify-center w-16 h-16 rounded-[22px] rotate-3 shadow-inner",
                        variant === 'danger' ? "bg-destructive/15" : "bg-primary/15"
                      )}
                    >
                      {icon === 'alert' ? (
                        <AlertCircle size={32} className={variant === 'danger' ? "text-destructive" : "text-primary"} />
                      ) : (
                        <HelpCircle size={32} className="text-primary" />
                      )}
                    </div>

                    {/* Text Section */}
                    <div className="flex flex-col gap-2.5">
                      <AlertDialog.Title 
                        className="text-2xl font-black leading-none tracking-tight text-foreground"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {title}
                      </AlertDialog.Title>
                      <AlertDialog.Description 
                        className="text-[15px] leading-snug text-muted-foreground font-semibold px-1"
                      >
                        {description}
                      </AlertDialog.Description>
                    </div>

                    {/* Actions Section */}
                    <div className="flex flex-col w-full gap-4 mt-6">
                      <AlertDialog.Action asChild><button
                        type="button"
                        onClick={onConfirm}
                        className={cn(
                          "flex items-center justify-center h-14 w-full px-8 text-[15px] font-black tracking-widest uppercase transition-all active:scale-[0.97] cursor-pointer shadow-2xl",
                          variant === 'danger' ? "hover:brightness-110" : "hover:brightness-105"
                        )}
                        style={{ 
                          borderRadius: '16px',
                          backgroundColor: variant === 'danger' ? 'var(--destructive)' : 'var(--primary)',
                          color: variant === 'danger' ? 'var(--destructive-foreground)' : 'var(--primary-foreground)',
                          boxShadow: variant === 'danger' 
                            ? '0 12px 48px -8px oklch(62% 0.24 25 / 0.5)' 
                            : '0 12px 48px -8px color-mix(in oklch, var(--primary) 45%, transparent)' 
                        }}
                      >
                        {confirmLabel}
                      </button></AlertDialog.Action>
                      
                      <AlertDialog.Cancel asChild><button
                        type="button"
                        className="flex items-center justify-center h-12 w-full px-6 text-sm font-extrabold transition-all hover:text-foreground text-muted-foreground cursor-pointer hover:bg-secondary/40 rounded-xl"
                      >
                        {cancelLabel}
                      </button></AlertDialog.Cancel>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        )}
      </AnimatePresence>
    </AlertDialog.Root>
  );
});

ConfirmationDialog.displayName = 'ConfirmationDialog';
