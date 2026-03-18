<?php

namespace App\Manga\Application\Actions;

use App\Manga\Application\DTOs\ScanMangaDTO;
use App\Manga\Application\Services\VolumeResolverService;
use App\Manga\Domain\Exceptions\MangaNotFoundException;
use App\Manga\Domain\Models\Edition;
use App\Manga\Domain\Repositories\EditionRepositoryInterface;
use App\Manga\Domain\Repositories\WishlistRepositoryInterface;
use Illuminate\Support\Facades\DB;

class AddScannedMangaToWishlistAction
{
    public function __construct(
        private readonly VolumeResolverService $volumeResolver,
        private readonly EditionRepositoryInterface $editionRepository,
        private readonly WishlistRepositoryInterface $wishlistRepository,
    ) {}

    public function execute(ScanMangaDTO $dto): Edition
    {
        return DB::transaction(function () use ($dto) {
            $volume = $this->volumeResolver->resolveByIsbn($dto->isbn);

            $this->wishlistRepository->addEditionWishlistToUser($volume->getEditionId(), $dto->userId);

            $edition = $this->editionRepository->findById($volume->getEditionId(), $dto->userId);
            if (! $edition) {
                throw new MangaNotFoundException('Edition not found for scanned volume.');
            }

            return $edition;
        });
    }
}
