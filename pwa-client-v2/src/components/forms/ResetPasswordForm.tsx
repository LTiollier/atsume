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

const resetSchema = z
  .object({
    password: z.string().min(8, 'Minimum 8 caractères'),
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['password_confirmation'],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

// Hoisted static JSX (rendering-hoist-jsx)
const successIcon = <CheckCircle2 size={40} aria-hidden style={{ color: 'var(--primary)' }} />;

interface ResetPasswordFormProps {
  token: string;
  email: string;
}

export function ResetPasswordForm({ token, email }: ResetPasswordFormProps) {
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  function onSubmit(data: ResetFormValues) {
    startTransition(async () => {
      try {
        await authService.resetPassword({ token, email, ...data });
        setDone(true);
      } catch (err) {
        toast.error(getApiErrorMessage(err, 'Erreur lors de la réinitialisation'));
      }
    });
  }

  // Success state — derived from state (rerender-derived-state-no-effect)
  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        {successIcon}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
            Mot de passe mis à jour
          </p>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
          </p>
        </div>
        <Link
          href="/login"
          className="text-sm font-medium transition-opacity hover:opacity-80"
          style={{ color: 'var(--primary)' }}
        >
          Se connecter
        </Link>
      </div>
    );
  }

  if (!token || !email) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Lien invalide ou expiré.
        </p>
        <Link
          href="/forgot-password"
          className="text-sm font-medium transition-opacity hover:opacity-80"
          style={{ color: 'var(--primary)' }}
        >
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <FormField
        label="Nouveau mot de passe"
        type="password"
        placeholder="Minimum 8 caractères"
        autoComplete="new-password"
        hint="8 caractères minimum"
        error={errors.password?.message}
        autoFocus
        {...register('password')}
      />

      <FormField
        label="Confirmation"
        type="password"
        placeholder="Répétez le mot de passe"
        autoComplete="new-password"
        error={errors.password_confirmation?.message}
        {...register('password_confirmation')}
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
        {isPending ? 'Enregistrement…' : 'Enregistrer le mot de passe'}
      </button>
    </form>
  );
}
