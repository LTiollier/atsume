import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Mot de passe oublié — Mangastore',
};

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="mb-6">
        <h1
          className="text-xl font-semibold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
        >
          Mot de passe oublié
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Recevez un lien de réinitialisation par email
        </p>
      </div>
      <ForgotPasswordForm />
    </>
  );
}
