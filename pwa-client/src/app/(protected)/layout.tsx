'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import { Shell } from '@/components/layout/Shell';
import { PageTransition } from '@/components/common/PageTransition';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard requireAuth={true}>
            <Shell>
                <PageTransition>
                    {children}
                </PageTransition>
            </Shell>
        </AuthGuard>
    );
}
