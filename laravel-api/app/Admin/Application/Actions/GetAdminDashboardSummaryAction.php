<?php

declare(strict_types=1);

namespace App\Admin\Application\Actions;

use App\Admin\Domain\Models\AdminDashboardSummary;
use App\Admin\Domain\Repositories\AdminRepositoryInterface;
use App\Admin\Domain\Services\JobStatusServiceInterface;

final class GetAdminDashboardSummaryAction
{
    public function __construct(
        private readonly AdminRepositoryInterface $adminRepository,
        private readonly JobStatusServiceInterface $jobStatusService,
    ) {}

    public function execute(): AdminDashboardSummary
    {
        return new AdminDashboardSummary(
            stats: $this->adminRepository->getMonthlyStats(),
            cronStatus: $this->jobStatusService->getCronStatus(),
        );
    }
}
