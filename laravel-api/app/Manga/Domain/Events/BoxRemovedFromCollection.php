<?php

declare(strict_types=1);

namespace App\Manga\Domain\Events;

use Illuminate\Foundation\Events\Dispatchable;

final class BoxRemovedFromCollection
{
    use Dispatchable;

    public function __construct(
        public readonly int $boxId,
        public readonly int $userId
    ) {}
}
