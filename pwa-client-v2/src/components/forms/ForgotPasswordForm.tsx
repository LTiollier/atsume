'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { authService } from '@/services/auth.service';
import { getApiErrorMessage } from '@/lib/error';
import { FormField } from './FormField';

const forgotSchema = z.object({
  email: z.string().email('Email invalide'),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

// Hoisted static JSX — identique à chaque render (rendering-hoist-jsx)
const successIcon = <CheckCircle2 size={40} aria-hidden style={{ color: 'var(--primary)' }} />;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  function onSubmit(data: ForgotFormValues) {
    startTransition(async () => {
      try {
        await authService.forgotPassword(data.email);
        setSent(true);
      } catch (err) {
        toast.error(getApiErrorMessage(err, 'Erreur lors de l\'envoi'));
      }
    });
  }

  // État succès — rendu conditionnel sans useEffect (rerender-derived-state-no-effect)
  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        {successIcon}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
            Email envoyé
          </p>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Vérifiez votre boîte pour{' '}
            <span style={{ color: 'var(--foreground)' }}>{getValues('email')}</span>
          </p>
        </div>
        <Link
          href="/login"
          className="text-sm font-medium transition-opacity hover:opacity-80"
          style={{ color: 'var(--primary)' }}
        >
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <FormField
        label="Email"
        type="email"
        placeholder="vous@exemple.com"
        autoComplete="email"
        hint="Vous recevrez un lien pour réinitialiser votre mot de passe"
        error={errors.email?.message}
        autoFocus
        {...register('email')}
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-11 flex items-center justify-center gap-2 rounded text-sm font-semibold transition-opacity disabled:opacity-60"
        style={{
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
          borderRadius: 'var(--radius)',
        }}
      >
        {isPending && <Loader2 size={16} className="animate-spin" aria-hidden />}
        {isPending ? 'Envoi…' : 'Envoyer le lien'}
      </button>

      <p className="text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
        <Link
          href="/login"
          className="font-medium transition-opacity hover:opacity-80"
          style={{ color: 'var(--primary)' }}
        >
          Retour à la connexion
        </Link>
      </p>
    </form>
  );
}
