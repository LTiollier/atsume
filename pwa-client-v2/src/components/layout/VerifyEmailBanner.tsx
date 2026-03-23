'use client';

import { useState, useTransition } from 'react';
import { Mail, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import { getApiErrorMessage } from '@/lib/error';

export function VerifyEmailBanner() {
  const { user, isAuthenticated } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [dismissed, setDismissed] = useState(false);

  // If not authenticated or already verified or manually dismissed, show nothing
  if (!isAuthenticated || !user || user.email_verified_at || dismissed) {
    return null;
  }

  const handleResend = () => {
    startTransition(async () => {
      try {
        await authService.sendVerificationEmail();
        toast.success('Lien de vérification envoyé !');
      } catch (err) {
        toast.error(getApiErrorMessage(err, 'Erreur lors de l\'envoi du mail'));
      }
    });
  };

  return (
    <div
      className="sticky top-0 z-50 flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-colors"
      style={{
        background: 'var(--accent)',
        color: 'var(--accent-foreground)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center gap-3">
        <Mail size={16} className="shrink-0" />
        <p>
          Veuillez vérifier votre email pour profiter de toutes les fonctionnalités.{' '}
          <button
            onClick={handleResend}
            disabled={isPending}
            className="underline underline-offset-4 font-bold hover:opacity-80 transition-opacity disabled:opacity-50 inline-flex items-center gap-1"
          >
            {isPending && <Loader2 size={12} className="animate-spin" />}
            Renvoyer le lien
          </button>
        </p>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        aria-label="Fermer"
      >
        <X size={16} />
      </button>
    </div>
  );
}
