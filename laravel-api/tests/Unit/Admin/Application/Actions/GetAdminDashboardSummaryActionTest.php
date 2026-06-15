<?php

use App\Admin\Application\Actions\GetAdminDashboardSummaryAction;
use App\Admin\Domain\Models\AdminStats;
use App\Admin\Domain\Models\CronStatus;
use App\Admin\Domain\Repositories\AdminRepositoryInterface;
use App\Admin\Domain\Services\JobStatusServiceInterface;

it('executes and returns summary', function () {
    $stats = new AdminStats(1, 2, 3);
    $cronStatus = new CronStatus(null, 0);

    $repository = Mockery::mock(AdminRepositoryInterface::class);
    $repository->shouldReceive('getMonthlyStats')->once()->andReturn($stats);

    $service = Mockery::mock(JobStatusServiceInterface::class);
    $service->shouldReceive('getCronStatus')->once()->andReturn($cronStatus);

    $action = new GetAdminDashboardSummaryAction($repository, $service);
    $summary = $action->execute();

    expect($summary->getStats())->toBe($stats)
        ->and($summary->getCronStatus())->toBe($cronStatus);
});
