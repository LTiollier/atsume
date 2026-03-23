<?php

declare(strict_types=1);

namespace App\User\Domain\Events;

use App\User\Domain\Models\User;
use Illuminate\Foundation\Events\Dispatchable;

final class UserVerified
{
    use Dispatchable;

    public function __construct(
        public readonly User $user
    ) {}
}
