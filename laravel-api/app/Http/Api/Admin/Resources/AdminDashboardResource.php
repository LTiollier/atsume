<?php

declare(strict_types=1);

namespace App\Http\Api\Admin\Resources;

use App\Admin\Domain\Models\AdminDashboardSummary;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read AdminDashboardSummary $resource
 */
final class AdminDashboardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'stats' => [
                'new_series' => $this->resource->getStats()->getNewSeriesCount(),
                'new_editions' => $this->resource->getStats()->getNewEditionsCount(),
                'new_volumes' => $this->resource->getStats()->getNewVolumesCount(),
            ],
            'cron' => [
                'last_run_at' => $this->resource->getCronStatus()->getLastRunAt(),
                'last_run_type' => $this->resource->getCronStatus()->getLastRunType(),
                'failed_jobs_count' => $this->resource->getCronStatus()->getFailedJobsCount(),
            ],
        ];
    }
}
