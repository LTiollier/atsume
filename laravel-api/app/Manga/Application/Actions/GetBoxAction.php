<?php

declare(strict_types=1);

namespace App\Manga\Application\Actions;

use App\Manga\Domain\Models\Box;
use App\Manga\Domain\Repositories\BoxRepositoryInterface;

class GetBoxAction
{
    public function __construct(
        private readonly BoxRepositoryInterface $boxRepository
    ) {}

    public function execute(int $id, ?int $userId = null): ?Box
    {
        return $this->boxRepository->findById($id, $userId);
    }
}
