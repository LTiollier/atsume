<?php

declare(strict_types=1);

namespace App\Manga\Domain\Events;

use Illuminate\Foundation\Events\Dispatchable;

class EditionAddedToCollection
{
    use Dispatchable;

    public function __construct(
        public readonly int $editionId,
        public readonly int $userId
    ) {}
}
