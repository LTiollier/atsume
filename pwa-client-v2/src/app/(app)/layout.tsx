import { Shell } from '@/components/layout/Shell';

/**
 * Layout protégé — toutes les routes app (dashboard, collection, scan…)
 *
 * AuthGuard : géré au niveau edge par src/middleware.ts
 * → redirect /login si pas de cookie auth_check / laravel_session
 * → 0 flash de contenu, 0 client-side check redondant
 *
 * Shell persiste entre les navigations (layout ≠ template) :
 * BottomNav et SidebarNav ne se re-montent pas à chaque changement de page.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}
