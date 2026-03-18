import api, { ApiResponse } from '@/lib/api';
import { ReadingProgress } from '@/types/manga';
import { ReadingProgressSchema } from '@/schemas/manga';
import { z } from 'zod';

export const readingProgressService = {
    getAll: () =>
        api.get<ApiResponse<ReadingProgress[]>>('/reading-progress').then(r => {
            try {
                return z.array(ReadingProgressSchema).parse(r.data.data);
            } catch (error) {
                console.error("ReadingProgress validation failed:", error);
                return r.data.data as unknown as ReadingProgress[];
            }
        }),

    toggleBulk: (volumeIds: number[]) =>
        api.post<{ toggled: ReadingProgress[], removed: number[] }>('/reading-progress/toggle/bulk', {
            volume_ids: volumeIds,
        }).then(r => r.data),
};
