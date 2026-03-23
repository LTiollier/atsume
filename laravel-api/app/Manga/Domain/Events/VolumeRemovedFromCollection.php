<?php

declare(strict_types=1);

namespace App\Manga\Domain\Events;

use Illuminate\Foundation\Events\Dispatchable;

final class VolumeRemovedFromCollection
{
    use Dispatchable;

    /**
     * @param  int[]  $volumeIds
     */
    public function __construct(
        public readonly array $volumeIds,
        public readonly int $userId
    ) {}
}
