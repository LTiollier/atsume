<?php

declare(strict_types=1);

namespace App\Admin\Domain\Repositories;

use App\Admin\Domain\Models\AdminStats;

interface AdminRepositoryInterface
{
    public function getMonthlyStats(): AdminStats;

    public function getFailedJobsCount(): int;
}
