<?php

declare(strict_types=1);

namespace App\Admin\Domain\Models;

final class AdminDashboardSummary
{
    public function __construct(
        private readonly AdminStats $stats,
        private readonly CronStatus $cronStatus,
    ) {}

    public function getStats(): AdminStats
    {
        return $this->stats;
    }

    public function getCronStatus(): CronStatus
    {
        return $this->cronStatus;
    }
}
