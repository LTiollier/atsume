<?php

declare(strict_types=1);

namespace App\Manga\Application\Actions;

use App\Manga\Domain\Repositories\VolumeRepositoryInterface;

final class RemoveSeriesFromCollectionAction
{
    public function __construct(
        private readonly VolumeRepositoryInterface $volumeRepository
    ) {}

    public function execute(int $seriesId, int $userId): void
    {
        $this->volumeRepository->detachSeriesFromUser($seriesId, $userId);
    }
}
