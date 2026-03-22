<?php

declare(strict_types=1);

namespace App\Manga\Application\Actions;

use App\Manga\Domain\Models\Edition;
use App\Manga\Domain\Repositories\EditionRepositoryInterface;

final class GetEditionAction
{
    public function __construct(
        private readonly EditionRepositoryInterface $editionRepository
    ) {}

    public function execute(int $id, ?int $userId = null): ?Edition
    {
        return $this->editionRepository->findById($id, $userId);
    }
}
