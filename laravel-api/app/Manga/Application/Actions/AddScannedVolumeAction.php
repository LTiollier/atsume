<?php

declare(strict_types=1);

namespace App\Manga\Application\Actions;

use App\Manga\Application\DTOs\ScanVolumeDTO;
use App\Manga\Domain\Events\VolumeAddedToCollection;
use App\Manga\Domain\Models\Volume;
use App\Manga\Domain\Repositories\VolumeRepositoryInterface;
use App\Manga\Domain\Services\VolumeResolverServiceInterface;
use Illuminate\Support\Facades\DB;

class AddScannedVolumeAction
{
    public function __construct(
        private readonly VolumeResolverServiceInterface $volumeResolver,
        private readonly VolumeRepositoryInterface $volumeRepository,
    ) {}

    public function execute(ScanVolumeDTO $dto): Volume
    {
        return DB::transaction(function () use ($dto) {
            $volume = $this->volumeResolver->resolveByIsbn($dto->isbn);

            $this->volumeRepository->attachToUser($volume->getId(), $dto->userId);

            event(new VolumeAddedToCollection($volume, $dto->userId));

            return $volume;
        });
    }
}
