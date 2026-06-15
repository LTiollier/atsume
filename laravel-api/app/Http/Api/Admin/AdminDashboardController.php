<?php

declare(strict_types=1);

namespace App\Http\Api\Admin;

use App\Admin\Application\Actions\GetAdminDashboardSummaryAction;
use App\Http\Api\Admin\Resources\AdminDashboardResource;

final class AdminDashboardController
{
    public function index(GetAdminDashboardSummaryAction $action): AdminDashboardResource
    {
        return new AdminDashboardResource($action->execute());
    }
}
