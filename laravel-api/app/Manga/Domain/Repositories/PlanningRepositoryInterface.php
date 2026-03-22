<?php

declare(strict_types=1);

namespace App\Manga\Domain\Repositories;

use App\Manga\Application\DTOs\PlanningFiltersDTO;
use App\Manga\Domain\Models\PlanningResult;

interface PlanningRepositoryInterface
{
    public function findPlanning(PlanningFiltersDTO $dto): PlanningResult;
}
