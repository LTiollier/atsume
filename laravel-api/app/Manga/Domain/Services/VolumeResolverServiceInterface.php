<?php

declare(strict_types=1);

namespace App\Manga\Domain\Services;

use App\Manga\Domain\Models\Volume;

interface VolumeResolverServiceInterface
{
    public function resolveByIsbn(string $isbn): Volume;

    public function resolveByApiId(string $apiId): Volume;
}
