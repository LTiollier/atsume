<?php

declare(strict_types=1);

namespace App\Manga\Infrastructure\Services;

use App\Manga\Domain\Exceptions\VolumeNotFoundException;
use App\Manga\Domain\Models\Volume;
use App\Manga\Domain\Repositories\VolumeRepositoryInterface;
use App\Manga\Domain\Services\VolumeResolverServiceInterface;

final class VolumeResolverService implements VolumeResolverServiceInterface
{
    public function __construct(
        private readonly VolumeRepositoryInterface $volumeRepository,
    ) {}

    /**
     * Resolve a Volume by ISBN locally.
     *
     * @throws VolumeNotFoundException
     */
    public function resolveByIsbn(string $isbn): Volume
    {
        $volume = $this->volumeRepository->findByIsbn($isbn);

        if ($volume) {
            return $volume;
        }

        throw new VolumeNotFoundException('Manga not found locally for barcode: '.$isbn);
    }

    /**
     * Resolve a Volume by API ID locally.
     *
     * @throws VolumeNotFoundException
     */
    public function resolveByApiId(string $apiId): Volume
    {
        $volume = $this->volumeRepository->findByApiId($apiId);

        if ($volume) {
            return $volume;
        }

        throw new VolumeNotFoundException('Manga not found locally with ID: '.$apiId);
    }
}
