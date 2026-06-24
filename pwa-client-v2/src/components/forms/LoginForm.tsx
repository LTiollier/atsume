'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { loginAction } from '@/app/actions/auth';
import { tokenStorage } from '@/lib/tokenStorage';
import { useAuth } from '@/contexts/AuthContext';
import { FormField } from './FormField';

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginFormValues) {
    startTransition(async () => {
      try {
        const result = await loginAction(data.email, data.password);

        if (!result.ok) {
          // Erreur attendue, retournée par la Server Action (vrai message, pas redacted)
          if (result.field === 'email' || result.field === 'password') {
            setError(result.field, { message: result.error });
          } else {
            toast.error(result.error);
          }
          return;
        }

        // Store token client-side (localStorage + auth_check cookie for middleware)
        tokenStorage.setToken(result.token);
        login(result.user);
        toast.success('Bienvenue ! Redirection en cours...');
        window.location.href = '/collection';
      } catch (err) {
        // Filet de sécurité : erreur serveur inattendue (redacted en prod + digest)
        console.error('[loginAction] échec inattendu :', err);
        const digest = (err as { digest?: string } | undefined)?.digest;
        toast.error('Erreur serveur lors de la connexion.', {
          description: digest ? `Digest : #${digest}` : undefined,
          duration: 10000,
        });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <FormField
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="username"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        placeholder="vous@exemple.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="flex flex-col gap-1.5">
        <FormField
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs transition-opacity hover:opacity-80"
            style={{ color: 'var(--primary)' }}
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-11 flex items-center justify-center gap-2 rounded text-sm font-semibold transition-opacity disabled:opacity-60 mt-1"
        style={{
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
          borderRadius: 'var(--radius)',
        }}
      >
        {isPending && <Loader2 size={16} className="animate-spin" aria-hidden />}
        {isPending ? 'Connexion…' : 'Se connecter'}
      </button>

      <p className="text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
        Pas encore de compte ?{' '}
        <Link
          href="/register"
          className="font-medium transition-opacity hover:opacity-80"
          style={{ color: 'var(--primary)' }}
        >
          S&apos;inscrire
        </Link>
      </p>
    </form>
  );
}
