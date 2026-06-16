import api, { ApiResponse } from '@/lib/api';

export interface AdminDashboardData {
    stats: {
        new_series: number;
        new_editions: number;
        new_volumes: number;
    };
    cron: {
        last_run_at: string | null;
        last_run_type: string | null;
        failed_jobs_count: number;
    };
}

export const adminService = {
    getDashboard: () =>
        api.get<ApiResponse<AdminDashboardData>>('/admin/dashboard').then(r => r.data.data),
};
