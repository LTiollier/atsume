import api from '@/lib/api';
import { PlanningResponse } from '@/types/volume';
import { PlanningResponseSchema } from '@/schemas/volume';

export const planningService = {
    getPage: (cursor?: string): Promise<PlanningResponse> =>
        api.get<PlanningResponse>('/planning', {
            params: {
                per_page: 24,
                ...(cursor ? { cursor } : {}),
            },
        }).then(r => PlanningResponseSchema.parse(r.data)),
};
