<?php

declare(strict_types=1);

namespace App\Admin\Infrastructure\Repositories;

use App\Admin\Domain\Models\AdminStats;
use App\Admin\Domain\Repositories\AdminRepositoryInterface;
use App\Manga\Infrastructure\EloquentModels\Edition;
use App\Manga\Infrastructure\EloquentModels\Series;
use App\Manga\Infrastructure\EloquentModels\Volume;
use Illuminate\Support\Facades\DB;

final class EloquentAdminRepository implements AdminRepositoryInterface
{
    public function getMonthlyStats(): AdminStats
    {
        $startOfMonth = now()->startOfMonth();

        $seriesCount = Series::where('created_at', '>=', $startOfMonth)->count();
        $editionsCount = Edition::where('created_at', '>=', $startOfMonth)->count();
        $volumesCount = Volume::where('created_at', '>=', $startOfMonth)->count();

        return new AdminStats(
            newSeriesCount: $seriesCount,
            newEditionsCount: $editionsCount,
            newVolumesCount: $volumesCount,
        );
    }

    public function getFailedJobsCount(): int
    {
        return DB::table('failed_jobs')->count();
    }
}
