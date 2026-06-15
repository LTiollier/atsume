<?php

declare(strict_types=1);

namespace App\Admin\Infrastructure\Services;

use App\Admin\Domain\Models\CronStatus;
use App\Admin\Domain\Services\JobStatusServiceInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

final class JobStatusService implements JobStatusServiceInterface
{
    public const LAST_CRON_RUN_KEY = 'last_cron_run_at';

    public const LAST_CRON_TYPE_KEY = 'last_cron_run_type';

    public function getCronStatus(): CronStatus
    {
        /** @var string|null $lastRunAt */
        $lastRunAt = Cache::get(self::LAST_CRON_RUN_KEY);

        /** @var string|null $lastRunType */
        $lastRunType = Cache::get(self::LAST_CRON_TYPE_KEY);

        $failedJobsCount = DB::table('failed_jobs')
            ->where('failed_at', '>=', today())
            ->count();

        return new CronStatus(
            lastRunAt: $lastRunAt,
            failedJobsCount: $failedJobsCount,
            lastRunType: $lastRunType,
        );
    }

    public function trackRun(string $command): void
    {
        Cache::put(self::LAST_CRON_RUN_KEY, now()->toIso8601String());
        Cache::put(self::LAST_CRON_TYPE_KEY, $command);
    }
}
