<?php

declare(strict_types=1);

namespace App\Admin\Domain\Models;

final class CronStatus
{
    public function __construct(
        private readonly ?string $lastRunAt,
        private readonly int $failedJobsCount,
        private readonly ?string $lastRunType = null,
    ) {}

    public function getLastRunAt(): ?string
    {
        return $this->lastRunAt;
    }

    public function getFailedJobsCount(): int
    {
        return $this->failedJobsCount;
    }

    public function getLastRunType(): ?string
    {
        return $this->lastRunType;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'last_run_at' => $this->lastRunAt,
            'failed_jobs_count' => $this->failedJobsCount,
            'last_run_type' => $this->lastRunType,
        ];
    }
}
