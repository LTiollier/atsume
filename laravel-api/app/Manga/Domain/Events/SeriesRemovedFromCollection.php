<?php

declare(strict_types=1);

namespace App\Manga\Domain\Events;

use Illuminate\Foundation\Events\Dispatchable;

final class SeriesRemovedFromCollection
{
    use Dispatchable;

    public function __construct(
        public readonly int $seriesId,
        public readonly int $userId
    ) {}
}
