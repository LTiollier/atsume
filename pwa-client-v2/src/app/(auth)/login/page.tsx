import type { Metadata } from 'next';
import { LoginForm } from '@/components/forms/LoginForm';

export const metadata: Metadata = {
  title: 'Connexion — Mangastore',
};

export default function LoginPage() {
  return (
    <>
      <div className="mb-6">
        <h1
          className="text-xl font-semibold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
        >
          Connexion
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Accédez à votre collection
        </p>
      </div>
      <LoginForm />
    </>
  );
}
