<?php

namespace App\Manga\Application\Services;

use App\Manga\Domain\Exceptions\MangaNotFoundException;
use App\Manga\Domain\Models\Volume;
use App\Manga\Domain\Repositories\VolumeRepositoryInterface;

class VolumeResolverService
{
    public function __construct(
        private readonly VolumeRepositoryInterface $volumeRepository,
    ) {}

    /**
     * Resolve a Volume by ISBN locally.
     *
     * @throws MangaNotFoundException
     */
    public function resolveByIsbn(string $isbn): Volume
    {
        $volume = $this->volumeRepository->findByIsbn($isbn);

        if ($volume) {
            return $volume;
        }

        throw new MangaNotFoundException('Manga not found locally for barcode: '.$isbn);
    }

    /**
     * Resolve a Volume by API ID locally.
     *
     * @throws MangaNotFoundException
     */
    public function resolveByApiId(string $apiId): Volume
    {
        $volume = $this->volumeRepository->findByApiId($apiId);

        if ($volume) {
            return $volume;
        }

        throw new MangaNotFoundException('Manga not found locally with ID: '.$apiId);
    }
}
