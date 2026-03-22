import type { Metadata } from 'next';
import { RegisterForm } from '@/components/forms/RegisterForm';

export const metadata: Metadata = {
  title: 'Créer un compte — Atsume',
};

export default function RegisterPage() {
  return (
    <>
      <div className="mb-6">
        <h1
          className="text-xl font-semibold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
        >
          Créer un compte
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Commencez à cataloguer votre collection
        </p>
      </div>
      <RegisterForm />
    </>
  );
}
