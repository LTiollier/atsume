<?php

declare(strict_types=1);

namespace App\Admin\Domain\Services;

use App\Admin\Domain\Models\CronStatus;

interface JobStatusServiceInterface
{
    public function getCronStatus(): CronStatus;

    public function trackRun(string $command): void;
}
