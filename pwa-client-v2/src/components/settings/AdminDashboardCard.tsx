'use client';

import { Activity, Database, Clock, AlertCircle, CheckCircle2, Loader2, RefreshCcw } from 'lucide-react';
import { useAdminDashboard } from '@/hooks/queries';
import { motion } from 'framer-motion';
import { sectionVariants } from '@/lib/motion';

export function AdminDashboardCard() {
    const { data, isLoading, isError, refetch, isFetching } = useAdminDashboard();

    if (isLoading) {
        return (
            <div
                className="rounded-[calc(var(--radius)*2)] p-8 flex flex-col items-center justify-center gap-3"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
                <Loader2 size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    Chargement des statistiques...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div
                className="rounded-[calc(var(--radius)*2)] p-8 flex flex-col items-center justify-center gap-3"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
                <AlertCircle size={24} style={{ color: 'var(--destructive)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--destructive)' }}>
                    Erreur lors de la récupération des données.
                </p>
                <button
                    onClick={() => refetch()}
                    className="text-xs font-semibold underline underline-offset-4"
                    style={{ color: 'var(--primary)' }}
                >
                    Réessayer
                </button>
            </div>
        );
    }

    const stats = data?.stats;
    const cron = data?.cron;

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Jamais';
        return new Date(dateString).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <motion.div
            variants={sectionVariants}
            className="flex flex-col gap-6"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity size={18} style={{ color: 'var(--primary)' }} />
                    <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                        Tableau de bord Admin
                    </h3>
                </div>
                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="p-2 rounded-full transition-colors hover:bg-[var(--muted)] disabled:opacity-50"
                    title="Actualiser"
                >
                    <RefreshCcw size={14} className={isFetching ? 'animate-spin' : ''} style={{ color: 'var(--muted-foreground)' }} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Statistiques d'activité */}
                <div
                    className="rounded-[calc(var(--radius)*2)] overflow-hidden"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                    <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--muted)', opacity: 0.5 }}>
                        <div className="flex items-center gap-2">
                            <Database size={14} style={{ color: 'var(--muted-foreground)' }} />
                            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
                                Activité du mois
                            </span>
                        </div>
                    </div>
                    <div className="p-5 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Nouvelles séries</span>
                            <span className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{stats?.new_series ?? 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Nouvelles éditions</span>
                            <span className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{stats?.new_editions ?? 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Nouveaux tomes</span>
                            <span className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{stats?.new_volumes ?? 0}</span>
                        </div>
                    </div>
                </div>

                {/* Santé du système */}
                <div
                    className="rounded-[calc(var(--radius)*2)] overflow-hidden"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                    <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--muted)', opacity: 0.5 }}>
                        <div className="flex items-center gap-2">
                            <Clock size={14} style={{ color: 'var(--muted-foreground)' }} />
                            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
                                Santé du système
                            </span>
                        </div>
                    </div>
                    <div className="p-5 flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Dernier passage (cron)</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                                    {formatDate(cron?.last_run_at ?? null)}
                                </span>
                                {cron?.last_run_type && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                                        {cron.last_run_type}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Jobs en échec</span>
                            <div className="flex items-center gap-2">
                                {cron?.failed_jobs_count === 0 ? (
                                    <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                                ) : (
                                    <AlertCircle size={16} style={{ color: 'var(--destructive)' }} />
                                )}
                                <span className="text-lg font-bold" style={{ color: cron?.failed_jobs_count === 0 ? '#10b981' : 'var(--destructive)' }}>
                                    {cron?.failed_jobs_count ?? 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
