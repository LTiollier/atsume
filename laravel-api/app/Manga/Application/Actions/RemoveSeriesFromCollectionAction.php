<?php

declare(strict_types=1);

namespace App\Manga\Application\Actions;

use App\Manga\Domain\Events\SeriesRemovedFromCollection;
use App\Manga\Domain\Repositories\VolumeRepositoryInterface;
use Illuminate\Support\Facades\DB;

final class RemoveSeriesFromCollectionAction
{
    public function __construct(
        private readonly VolumeRepositoryInterface $volumeRepository
    ) {}

    public function execute(int $seriesId, int $userId): void
    {
        DB::transaction(function () use ($seriesId, $userId) {
            $this->volumeRepository->detachSeriesFromUser($seriesId, $userId);

            event(new SeriesRemovedFromCollection($seriesId, $userId));
        });
    }
}
