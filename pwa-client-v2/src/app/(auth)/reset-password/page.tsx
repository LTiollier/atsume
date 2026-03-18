import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/forms/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Réinitialiser le mot de passe — Mangastore',
};

interface Props {
  searchParams: Promise<{ token?: string; email?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token = '', email = '' } = await searchParams;

  return (
    <>
      <div className="mb-6">
        <h1
          className="text-xl font-semibold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
        >
          Nouveau mot de passe
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Choisissez un mot de passe sécurisé
        </p>
      </div>
      <ResetPasswordForm token={token} email={email} />
    </>
  );
}
