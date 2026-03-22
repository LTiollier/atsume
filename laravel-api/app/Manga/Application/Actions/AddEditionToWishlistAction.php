<?php

declare(strict_types=1);

namespace App\Manga\Application\Actions;

use App\Manga\Domain\Exceptions\MangaNotFoundException;
use App\Manga\Domain\Models\Edition;
use App\Manga\Domain\Repositories\EditionRepositoryInterface;
use App\Manga\Domain\Repositories\WishlistRepositoryInterface;

class AddEditionToWishlistAction
{
    public function __construct(
        private readonly EditionRepositoryInterface $editionRepository,
        private readonly WishlistRepositoryInterface $wishlistRepository
    ) {}

    public function execute(int $editionId, int $userId): Edition
    {
        $edition = $this->editionRepository->findById($editionId, $userId);
        if (! $edition) {
            throw new MangaNotFoundException('Edition not found with ID: '.$editionId);
        }

        $this->wishlistRepository->addEditionWishlistToUser($editionId, $userId);

        return $edition;
    }
}
