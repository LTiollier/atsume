<?php

declare(strict_types=1);

namespace App\ReadingProgress\Application\Actions;

use App\ReadingProgress\Domain\Models\ReadingProgress;
use App\ReadingProgress\Domain\Repositories\ReadingProgressRepositoryInterface;

final class ListReadingProgressAction
{
    public function __construct(
        private readonly ReadingProgressRepositoryInterface $readingProgressRepository,
    ) {}

    /**
     * @return ReadingProgress[]
     */
    public function execute(int $userId): array
    {
        return $this->readingProgressRepository->findAllByUserId($userId);
    }
}
