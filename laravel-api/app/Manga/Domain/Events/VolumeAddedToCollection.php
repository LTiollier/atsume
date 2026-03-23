<?php

declare(strict_types=1);

namespace App\Manga\Domain\Events;

use App\Manga\Domain\Models\Volume;
use Illuminate\Foundation\Events\Dispatchable;

class VolumeAddedToCollection
{
    use Dispatchable;

    public function __construct(
        public readonly Volume $volume,
        public readonly int $userId
    ) {}
}
