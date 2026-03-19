import { Shell } from '@/components/layout/Shell';

/**
 * Protected layout — all app routes (dashboard, collection, scan…)
 *
 * AuthGuard: handled at edge by src/middleware.ts
 * → redirects to /login if auth_check / laravel_session cookie is missing
 * → no content flash, no redundant client-side check
 *
 * Shell persists across navigations (layout ≠ template):
 * BottomNav and SidebarNav do not remount on each page change.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}
