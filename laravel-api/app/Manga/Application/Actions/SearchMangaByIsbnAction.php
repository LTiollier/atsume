<?php

declare(strict_types=1);

namespace App\Manga\Application\Actions;

use App\Manga\Domain\Exceptions\MangaNotFoundException;
use App\Manga\Domain\Models\Volume;
use App\Manga\Domain\Repositories\VolumeRepositoryInterface;

final class SearchMangaByIsbnAction
{
    public function __construct(
        private readonly VolumeRepositoryInterface $volumeRepository,
    ) {}

    /**
     * @throws MangaNotFoundException
     */
    public function execute(string $isbn): Volume
    {
        $volume = $this->volumeRepository->findByIsbnWithRelations($isbn);

        if ($volume === null) {
            throw new MangaNotFoundException("No manga found for ISBN: {$isbn}");
        }

        return $volume;
    }
}
